import { useNavigate } from 'react-router-dom';
import type { Title } from '../types';

interface Props {
  title: Title;
  onInfo: (title: Title) => void;
}

export default function Billboard({ title, onInfo }: Props) {
  const navigate = useNavigate();
  return (
    <section className="billboard">
      <img className="billboard-bg" src={title.backdropUrl} alt="" />
      <div className="billboard-content">
        <h1 className="billboard-title">{title.name}</h1>
        <p className="billboard-desc">{title.description}</p>
        <div className="billboard-buttons">
          <button className="btn btn-play" onClick={() => navigate(`/watch/${title.id}`)}>
            ▶ Play
          </button>
          <button className="btn btn-info" onClick={() => onInfo(title)}>
            ⓘ More Info
          </button>
        </div>
      </div>
    </section>
  );
}
