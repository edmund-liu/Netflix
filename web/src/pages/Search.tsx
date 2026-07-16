import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import TitleCard from '../components/TitleCard';
import TitleModal from '../components/TitleModal';
import { searchTitles, TITLES } from '../data/catalog';
import type { Title } from '../types';

export default function Search() {
  const [params] = useSearchParams();
  const query = params.get('q') ?? '';
  const [selected, setSelected] = useState<Title | null>(null);

  const results = useMemo(
    () => (query.trim() ? searchTitles(query) : TITLES),
    [query]
  );

  return (
    <>
      <NavBar />
      <main className="page">
        <h1>{query.trim() ? `Results for “${query.trim()}”` : 'Browse all'}</h1>
        <p className="page-note">
          {results.length} title{results.length === 1 ? '' : 's'}
        </p>
        {results.length === 0 ? (
          <div className="empty">
            <div className="big">🔍</div>
            <p>No titles match your search.</p>
          </div>
        ) : (
          <div className="grid">
            {results.map((t) => (
              <TitleCard key={t.id} title={t} onClick={setSelected} />
            ))}
          </div>
        )}
      </main>
      {selected && <TitleModal title={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
