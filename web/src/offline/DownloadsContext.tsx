/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { DownloadRecord, Title } from '../types';

/**
 * Web equivalent of the mobile app's private offline storage.
 *
 * Videos are downloaded with fetch() and stored as Blobs in IndexedDB,
 * which is sandboxed to this site's origin — no other website, and no
 * ordinary file on disk, exposes the video. Playback goes through a
 * transient blob: URL handed only to the in-app <video> element; the app
 * offers no export/save path, so downloads are only watchable here.
 */
const DB_NAME = 'netflix-offline';
const STORE = 'videos';
const META_KEY = 'netflix.web.downloads.v1';

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) {
        req.result.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbPut(key: string, value: Blob): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function idbGet(key: string): Promise<Blob | undefined> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE, 'readonly').objectStore(STORE).get(key);
    req.onsuccess = () => resolve(req.result as Blob | undefined);
    req.onerror = () => reject(req.error);
  });
}

async function idbDelete(key: string): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function idbKeys(): Promise<string[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE, 'readonly').objectStore(STORE).getAllKeys();
    req.onsuccess = () => resolve(req.result as string[]);
    req.onerror = () => reject(req.error);
  });
}

interface DownloadsContextValue {
  records: Record<string, DownloadRecord>;
  getRecord: (titleId: string) => DownloadRecord | undefined;
  /** Creates a transient blob: URL for in-app playback, or null if not downloaded. */
  createLocalUrl: (titleId: string) => Promise<string | null>;
  startDownload: (title: Title) => Promise<void>;
  cancelDownload: (titleId: string) => void;
  removeDownload: (titleId: string) => Promise<void>;
}

const DownloadsContext = createContext<DownloadsContextValue | undefined>(undefined);

export function DownloadsProvider({ children }: { children: React.ReactNode }) {
  const [records, setRecords] = useState<Record<string, DownloadRecord>>({});
  const aborters = useRef<Map<string, AbortController>>(new Map());

  // Restore metadata, keeping only entries whose blob still exists.
  useEffect(() => {
    (async () => {
      try {
        const raw = localStorage.getItem(META_KEY);
        if (!raw) return;
        const stored = JSON.parse(raw) as Record<string, DownloadRecord>;
        const keys = new Set(await idbKeys());
        const valid: Record<string, DownloadRecord> = {};
        for (const [id, rec] of Object.entries(stored)) {
          if (rec.state === 'downloaded' && keys.has(id)) valid[id] = rec;
        }
        setRecords(valid);
      } catch {
        // Corrupt metadata — start empty.
      }
    })();
  }, []);

  const persist = useCallback((next: Record<string, DownloadRecord>) => {
    const durable: Record<string, DownloadRecord> = {};
    for (const [id, rec] of Object.entries(next)) {
      if (rec.state === 'downloaded') durable[id] = rec;
    }
    localStorage.setItem(META_KEY, JSON.stringify(durable));
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
      if (aborters.current.has(title.id)) return;
      const aborter = new AbortController();
      aborters.current.set(title.id, aborter);

      const initial: DownloadRecord = {
        titleId: title.id,
        state: 'downloading',
        progress: 0,
        fileName: title.id,
        bytesWritten: 0,
        bytesTotal: 0,
      };
      setRecords((prev) => ({ ...prev, [title.id]: initial }));

      try {
        const res = await fetch(title.videoUrl, { signal: aborter.signal });
        if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);
        const total = Number(res.headers.get('content-length') ?? 0);

        const reader = res.body.getReader();
        const chunks: BlobPart[] = [];
        let received = 0;
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
          received += value.byteLength;
          updateRecord(title.id, {
            progress: total > 0 ? received / total : 0,
            bytesWritten: received,
            bytesTotal: total,
          });
        }

        await idbPut(title.id, new Blob(chunks, { type: 'video/mp4' }));
        updateRecord(title.id, {
          state: 'downloaded',
          progress: 1,
          downloadedAt: Date.now(),
        });
      } catch (err) {
        if (!aborter.signal.aborted) {
          console.warn(`Download failed for ${title.id}:`, err);
          updateRecord(title.id, { state: 'failed' });
        }
      } finally {
        aborters.current.delete(title.id);
      }
    },
    [updateRecord]
  );

  const cancelDownload = useCallback(
    (titleId: string) => {
      aborters.current.get(titleId)?.abort();
      aborters.current.delete(titleId);
      void idbDelete(titleId);
      setRecords((prev) => {
        const next = { ...prev };
        delete next[titleId];
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const removeDownload = useCallback(
    async (titleId: string) => {
      await idbDelete(titleId);
      setRecords((prev) => {
        const next = { ...prev };
        delete next[titleId];
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const getRecord = useCallback((titleId: string) => records[titleId], [records]);

  const createLocalUrl = useCallback(
    async (titleId: string) => {
      const rec = records[titleId];
      if (!rec || rec.state !== 'downloaded') return null;
      const blob = await idbGet(titleId);
      return blob ? URL.createObjectURL(blob) : null;
    },
    [records]
  );

  const value = useMemo(
    () => ({
      records,
      getRecord,
      createLocalUrl,
      startDownload,
      cancelDownload,
      removeDownload,
    }),
    [records, getRecord, createLocalUrl, startDownload, cancelDownload, removeDownload]
  );

  return <DownloadsContext.Provider value={value}>{children}</DownloadsContext.Provider>;
}

export function useDownloads(): DownloadsContextValue {
  const ctx = useContext(DownloadsContext);
  if (!ctx) throw new Error('useDownloads must be used inside <DownloadsProvider>');
  return ctx;
}
