import { useDownloads } from '../offline/DownloadsContext';
import type { Title } from '../types';

interface Props {
  title: Title;
  onClick: (title: Title) => void;
}

export default function TitleCard({ title, onClick }: Props) {
  const { getRecord } = useDownloads();
  const downloaded = getRecord(title.id)?.state === 'downloaded';

  return (
    <div className="card" onClick={() => onClick(title)}>
      <img src={title.posterUrl} alt={title.name} loading="lazy" />
      {title.isOriginal && <span className="card-badge">N</span>}
      {downloaded && (
        <span className="card-downloaded" title="Available offline">
          ✓
        </span>
      )}
      <div className="card-overlay">
        <p className="card-name">{title.name}</p>
        <p className="card-meta">
          {title.year} • {title.durationMinutes} min
        </p>
      </div>
    </div>
  );
}
