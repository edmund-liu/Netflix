export interface Title {
  id: string;
  name: string;
  description: string;
  videoUrl: string;
  posterUrl: string;
  backdropUrl: string;
  year: number;
  maturityRating: string;
  durationMinutes: number;
  genres: string[];
  isOriginal?: boolean;
  trending?: boolean;
}

export interface CatalogRow {
  id: string;
  label: string;
  titleIds: string[];
}

export type DownloadState =
  | 'not_downloaded'
  | 'queued'
  | 'downloading'
  | 'paused'
  | 'downloaded'
  | 'failed';

export interface DownloadRecord {
  titleId: string;
  state: DownloadState;
  progress: number; // 0..1
  /** Obfuscated file name inside the app-private downloads directory. */
  fileName: string;
  bytesWritten: number;
  bytesTotal: number;
  downloadedAt?: number;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  provider: 'google' | 'demo';
}
