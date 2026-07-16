import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function NavBar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [solid, setSolid] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className={`nav${solid ? ' solid' : ''}`}>
      <NavLink to="/" className="nav-logo">
        NETFLIX
      </NavLink>
      <nav className="nav-links">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/downloads">Downloads</NavLink>
      </nav>
      <div className="nav-right">
        <form onSubmit={submitSearch}>
          <input
            className="nav-search"
            placeholder="Titles, genres…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>
        <div className="nav-avatar" title={user?.email}>
          {user?.photoUrl ? (
            <img src={user.photoUrl} alt={user.name} referrerPolicy="no-referrer" />
          ) : (
            (user?.name?.[0] ?? '?').toUpperCase()
          )}
        </div>
        <button className="nav-signout" onClick={signOut}>
          Sign out
        </button>
      </div>
    </header>
  );
}
