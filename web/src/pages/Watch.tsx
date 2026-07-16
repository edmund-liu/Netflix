import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDownloads } from '../offline/DownloadsContext';
import { getTitle } from '../data/catalog';

/**
 * The only playback surface for downloaded content. Offline videos are
 * loaded from IndexedDB into a transient blob: URL that is revoked when
 * the page unmounts — nothing persistent or shareable ever exposes them.
 */
export default function Watch() {
  const { titleId } = useParams<{ titleId: string }>();
  const navigate = useNavigate();
  const { createLocalUrl } = useDownloads();

  const title = titleId ? getTitle(titleId) : undefined;
  const [src, setSrc] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    if (!title) return;
    let blobUrl: string | null = null;
    let cancelled = false;
    (async () => {
      blobUrl = await createLocalUrl(title.id);
      if (cancelled) {
        if (blobUrl) URL.revokeObjectURL(blobUrl);
        return;
      }
      setOffline(Boolean(blobUrl));
      setSrc(blobUrl ?? title.videoUrl);
    })();
    return () => {
      cancelled = true;
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [title, createLocalUrl]);

  if (!title) {
    return (
      <div className="watch">
        <button className="watch-back" onClick={() => navigate(-1)}>
          ←
        </button>
        <p className="empty">Title not found.</p>
      </div>
    );
  }

  return (
    <div className="watch">
      {src && (
        <video
          src={src}
          controls
          autoPlay
          controlsList="nodownload"
          onContextMenu={(e) => e.preventDefault()}
        />
      )}
      <button className="watch-back" onClick={() => navigate(-1)} title="Back">
        ←
      </button>
      {offline && <div className="watch-offline-pill">⬇ Playing offline</div>}
    </div>
  );
}
