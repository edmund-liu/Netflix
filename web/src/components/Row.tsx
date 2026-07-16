import type { Title } from '../types';
import TitleCard from './TitleCard';

interface Props {
  label: string;
  titles: Title[];
  onSelect: (title: Title) => void;
}

export default function Row({ label, titles, onSelect }: Props) {
  if (titles.length === 0) return null;
  return (
    <div className="row">
      <h2 className="row-title">{label}</h2>
      <div className="row-scroller">
        {titles.map((t) => (
          <TitleCard key={t.id} title={t} onClick={onSelect} />
        ))}
      </div>
    </div>
  );
}
