import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import TitleModal from '../components/TitleModal';
import { getTitle } from '../data/catalog';
import { useDownloads } from '../offline/DownloadsContext';
import type { DownloadRecord, Title } from '../types';

interface Item {
  record: DownloadRecord;
  title: Title;
}

function formatBytes(bytes: number): string {
  if (bytes <= 0) return '—';
  const mb = bytes / (1024 * 1024);
  return mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${mb.toFixed(0)} MB`;
}

export default function Downloads() {
  const navigate = useNavigate();
  const { records, removeDownload, cancelDownload } = useDownloads();
  const [selected, setSelected] = useState<Title | null>(null);

  const items: Item[] = useMemo(
    () =>
      Object.values(records)
        .map((record) => ({ record, title: getTitle(record.titleId) }))
        .filter((i): i is Item => Boolean(i.title))
        .sort((a, b) => (b.record.downloadedAt ?? 0) - (a.record.downloadedAt ?? 0)),
    [records]
  );

  return (
    <>
      <NavBar />
      <main className="page">
        <h1>Downloads</h1>
        <p className="page-note">
          🔒 Downloads are stored in this app's private browser storage and can only be
          played here — they are not saved as files on your device.
        </p>
        {items.length === 0 ? (
          <div className="empty">
            <div className="big">⬇</div>
            <h2>No downloads yet</h2>
            <p>
              Titles you download appear here, ready to watch without internet.{' '}
              <Link to="/" style={{ textDecoration: 'underline' }}>
                Find something to download
              </Link>
            </p>
          </div>
        ) : (
          <div className="dl-list">
            {items.map(({ record, title }) => {
              const ready = record.state === 'downloaded';
              return (
                <div className="dl-item" key={record.titleId}>
                  <img
                    className="dl-thumb"
                    src={title.posterUrl}
                    alt={title.name}
                    onClick={() =>
                      ready ? navigate(`/watch/${title.id}`) : setSelected(title)
                    }
                  />
                  <div className="dl-info">
                    <p className="dl-name">{title.name}</p>
                    <p className="dl-meta">
                      {ready
                        ? `${formatBytes(
                            record.bytesTotal || record.bytesWritten
                          )} • Ready to watch offline`
                        : record.state === 'downloading'
                          ? `Downloading… ${Math.round(record.progress * 100)}%`
                          : record.state}
                    </p>
                    {record.state === 'downloading' && (
                      <div className="progress-track">
                        <div
                          className="progress-fill"
                          style={{ width: `${record.progress * 100}%` }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="dl-actions">
                    {ready && (
                      <button
                        className="btn-small"
                        onClick={() => navigate(`/watch/${title.id}`)}
                      >
                        ▶ Play
                      </button>
                    )}
                    <button
                      className="btn-small ghost"
                      onClick={() =>
                        ready ? removeDownload(title.id) : cancelDownload(title.id)
                      }
                    >
                      {ready ? 'Remove' : 'Cancel'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      {selected && <TitleModal title={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
