import { useState } from 'react';
import Billboard from '../components/Billboard';
import NavBar from '../components/NavBar';
import Row from '../components/Row';
import TitleModal from '../components/TitleModal';
import { CATALOG_ROWS, getTitle, HERO_TITLE_ID } from '../data/catalog';
import type { Title } from '../types';

export default function Browse() {
  const [selected, setSelected] = useState<Title | null>(null);
  const hero = getTitle(HERO_TITLE_ID);

  return (
    <>
      <NavBar />
      {hero && <Billboard title={hero} onInfo={setSelected} />}
      <main className="rows">
        {CATALOG_ROWS.map((row) => (
          <Row
            key={row.id}
            label={row.label}
            titles={row.titleIds.map(getTitle).filter((t): t is Title => Boolean(t))}
            onSelect={setSelected}
          />
        ))}
      </main>
      {selected && <TitleModal title={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
