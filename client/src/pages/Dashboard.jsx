import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCatalog } from '../context/CatalogContext.jsx';
import api, { errorMessage } from '../services/api.js';
import CreationCard from '../components/CreationCard.jsx';
import TypePicker from '../components/TypePicker.jsx';
import Alert from '../components/Alert.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  const { categories, loading: catLoading, error: catError } = useCatalog();
  const [query, setQuery] = useState('');
  const [data, setData] = useState({ total: 0, recent: [] });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/creations/stats').then((r) => setData(r.data)).catch((e) => setError(errorMessage(e))).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Welcome, {user.name.split(' ')[0]}</h1>
          <p className="muted">{data.total === 0 ? 'What would you like to create first?' : `${data.total} creation${data.total === 1 ? '' : 's'} saved so far.`}</p>
        </div>
        <Link className="btn btn-primary" to="/create">Create content</Link>
      </div>

      <Alert>{error || catError}</Alert>

      <input className="search" type="search" placeholder="Search content types, e.g. poster or LinkedIn" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search content types" />

      {query.trim() ? <TypePicker query={query} /> : (
        <>
          {catLoading ? <span className="spinner" /> : (
            <div className="cat-grid">
              {categories.map((c) => (
                <Link key={c.id} to={`/create?category=${c.id}`} className="cat cat-link"><h3>{c.label}</h3><p>{c.blurb}</p></Link>
              ))}
            </div>
          )}

          <h2>Recent creations</h2>
          {loading ? <span className="spinner" /> : data.recent.length === 0 ? (
            <div className="empty"><p>Nothing saved yet.</p><Link className="btn btn-primary" to="/create">Create your first piece of content</Link></div>
          ) : (
            <div className="grid">{data.recent.map((c) => <CreationCard key={c.id} creation={c} />)}</div>
          )}
        </>
      )}
    </>
  );
}
