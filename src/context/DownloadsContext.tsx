import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import * as FileSystem from 'expo-file-system/legacy';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { DownloadRecord, Title } from '../types';

/**
 * Offline downloads are written to the app's PRIVATE sandboxed storage:
 *   - iOS: the app's Documents container (inaccessible to other apps).
 *   - Android: internal storage under /data/data/<package>/files
 *     (inaccessible to other apps, file managers, and the media scanner).
 *
 * On top of the OS sandbox, files are stored under an opaque SHA-256 name
 * with a private ".nfv" extension (no MIME association), so even on a
 * compromised device nothing identifies or auto-plays them as videos.
 * Playback happens exclusively inside the app via the in-app player, and
 * the app never exposes a share/export path for downloaded files.
 */
const DOWNLOADS_DIR = `${FileSystem.documentDirectory}downloads/`;
const RECORDS_KEY = 'netflix.downloads.v1';

interface DownloadsContextValue {
  records: Record<string, DownloadRecord>;
  getRecord: (titleId: string) => DownloadRecord | undefined;
  /** Returns a file:// URI for in-app playback, or null if not downloaded. */
  getLocalUri: (titleId: string) => string | null;
  startDownload: (title: Title) => Promise<void>;
  cancelDownload: (titleId: string) => Promise<void>;
  removeDownload: (titleId: string) => Promise<void>;
}

const DownloadsContext = createContext<DownloadsContextValue | undefined>(undefined);

async function obfuscatedFileName(titleId: string): Promise<string> {
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `netflix-offline:${titleId}`
  );
  return `${digest}.nfv`;
}

async function ensureDownloadsDir(): Promise<void> {
  const info = await FileSystem.getInfoAsync(DOWNLOADS_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(DOWNLOADS_DIR, { intermediates: true });
  }
}

export function DownloadsProvider({ children }: { children: React.ReactNode }) {
  const [records, setRecords] = useState<Record<string, DownloadRecord>>({});
  const activeDownloads = useRef<Map<string, FileSystem.DownloadResumable>>(new Map());

  // Restore persisted records, dropping any whose file vanished.
  useEffect(() => {
    (async () => {
      try {
        await ensureDownloadsDir();
        const raw = await AsyncStorage.getItem(RECORDS_KEY);
        if (!raw) return;
        const stored = JSON.parse(raw) as Record<string, DownloadRecord>;
        const valid: Record<string, DownloadRecord> = {};
        for (const [id, rec] of Object.entries(stored)) {
          if (rec.state !== 'downloaded') continue; // in-flight downloads don't survive restarts
          const info = await FileSystem.getInfoAsync(DOWNLOADS_DIR + rec.fileName);
          if (info.exists) valid[id] = rec;
        }
        setRecords(valid);
      } catch {
        // Start with an empty download list on corrupt state.
      }
    })();
  }, []);

  const persist = useCallback((next: Record<string, DownloadRecord>) => {
    const durable: Record<string, DownloadRecord> = {};
    for (const [id, rec] of Object.entries(next)) {
      if (rec.state === 'downloaded') durable[id] = rec;
    }
    AsyncStorage.setItem(RECORDS_KEY, JSON.stringify(durable)).catch(() => {});
  }, []);

  const updateRecord = useCallback(
    (titleId: string, patch: Partial<DownloadRecord>) => {
      setRecords((prev) => {
        const existing = prev[titleId];
        if (!existing) return prev;
        const next = { ...prev, [titleId]: { ...existing, ...patch } };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const startDownload = useCallback(
    async (title: Title) => {
      if (activeDownloads.current.has(title.id)) return;
      await ensureDownloadsDir();
      const fileName = await obfuscatedFileName(title.id);
      const target = DOWNLOADS_DIR + fileName;

      const initial: DownloadRecord = {
        titleId: title.id,
        state: 'downloading',
        progress: 0,
        fileName,
        bytesWritten: 0,
        bytesTotal: 0,
      };
      setRecords((prev) => ({ ...prev, [title.id]: initial }));

      const resumable = FileSystem.createDownloadResumable(
        title.videoUrl,
        target,
        {},
        (p) => {
          const progress =
            p.totalBytesExpectedToWrite > 0
              ? p.totalBytesWritten / p.totalBytesExpectedToWrite
              : 0;
          updateRecord(title.id, {
            progress,
            bytesWritten: p.totalBytesWritten,
            bytesTotal: p.totalBytesExpectedToWrite,
          });
        }
      );
      activeDownloads.current.set(title.id, resumable);

      try {
        const result = await resumable.downloadAsync();
        activeDownloads.current.delete(title.id);
        if (!result) {
          // Cancelled — record cleanup handled by cancelDownload.
          return;
        }
        updateRecord(title.id, {
          state: 'downloaded',
          progress: 1,
          downloadedAt: Date.now(),
        });
      } catch (err) {
        activeDownloads.current.delete(title.id);
        console.warn(`Download failed for ${title.id}:`, err);
        updateRecord(title.id, { state: 'failed' });
        FileSystem.deleteAsync(target, { idempotent: true }).catch(() => {});
      }
    },
    [updateRecord]
  );

  const cancelDownload = useCallback(
    async (titleId: string) => {
      const resumable = activeDownloads.current.get(titleId);
      activeDownloads.current.delete(titleId);
      if (resumable) {
        try {
          await resumable.cancelAsync();
        } catch {
          // Already finished or never started.
        }
      }
      const rec = records[titleId];
      if (rec) {
        FileSystem.deleteAsync(DOWNLOADS_DIR + rec.fileName, { idempotent: true }).catch(
          () => {}
        );
      }
      setRecords((prev) => {
        const next = { ...prev };
        delete next[titleId];
        persist(next);
        return next;
      });
    },
    [persist, records]
  );

  const removeDownload = useCallback(
    async (titleId: string) => cancelDownload(titleId),
    [cancelDownload]
  );

  const getRecord = useCallback((titleId: string) => records[titleId], [records]);

  const getLocalUri = useCallback(
    (titleId: string) => {
      const rec = records[titleId];
      if (!rec || rec.state !== 'downloaded') return null;
      return DOWNLOADS_DIR + rec.fileName;
    },
    [records]
  );

  const value = useMemo(
    () => ({ records, getRecord, getLocalUri, startDownload, cancelDownload, removeDownload }),
    [records, getRecord, getLocalUri, startDownload, cancelDownload, removeDownload]
  );

  return <DownloadsContext.Provider value={value}>{children}</DownloadsContext.Provider>;
}

export function useDownloads(): DownloadsContextValue {
  const ctx = useContext(DownloadsContext);
  if (!ctx) throw new Error('useDownloads must be used inside <DownloadsProvider>');
  return ctx;
}
