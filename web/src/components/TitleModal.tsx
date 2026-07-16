import { useNavigate } from 'react-router-dom';
import { useDownloads } from '../offline/DownloadsContext';
import type { Title } from '../types';

interface Props {
  title: Title;
  onClose: () => void;
}

export default function TitleModal({ title, onClose }: Props) {
  const navigate = useNavigate();
  const { getRecord, startDownload, cancelDownload, removeDownload } = useDownloads();
  const record = getRecord(title.id);
  const state = record?.state ?? 'not_downloaded';

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-hero">
          <img src={title.backdropUrl} alt="" />
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
          <div className="modal-hero-content">
            <h2>{title.name}</h2>
            <button className="btn btn-play" onClick={() => navigate(`/watch/${title.id}`)}>
              ▶ {state === 'downloaded' ? 'Play Offline' : 'Play'}
            </button>
          </div>
        </div>
        <div className="modal-body">
          <div className="modal-meta">
            <span>{title.year}</span>
            <span className="badge-rating">{title.maturityRating}</span>
            <span>{title.durationMinutes} min</span>
            {state === 'downloaded' && <span className="badge-offline">✓ Available offline</span>}
          </div>
          <p className="modal-desc">{title.description}</p>
          <p className="modal-genres">
            Genres: <span>{title.genres.join(', ')}</span>
          </p>
          <div className="download-line">
            {state === 'downloading' ? (
              <>
                <button className="btn-download" onClick={() => cancelDownload(title.id)}>
                  Downloading… {Math.round((record?.progress ?? 0) * 100)}% (cancel)
                </button>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${(record?.progress ?? 0) * 100}%` }}
                  />
                </div>
              </>
            ) : state === 'downloaded' ? (
              <button className="btn-download" onClick={() => removeDownload(title.id)}>
                ✓ Downloaded — remove
              </button>
            ) : (
              <button className="btn-download" onClick={() => startDownload(title)}>
                ⬇ {state === 'failed' ? 'Retry Download' : 'Download'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
