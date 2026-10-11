import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errorMessage } from '../services/api.js';
import { useCatalog } from '../context/CatalogContext.jsx';
import CreationCard from '../components/CreationCard.jsx';
import Alert from '../components/Alert.jsx';

export default function Creations() {
  const { categories } = useCatalog();
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ creations: [], pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      api.get('/creations', { params: { q, category, page } })
        .then((r) => { setData(r.data); setError(''); })
        .catch((e) => setError(errorMessage(e)))
        .finally(() => setLoading(false));
    }, q ? 300 : 0);
    return () => clearTimeout(t);
  }, [q, category, page]);

  return (
    <>
      <div className="page-head">
        <div><h1>My creations</h1><p className="muted">{data.total} saved</p></div>
        <Link className="btn btn-primary" to="/create">Create content</Link>
      </div>
      <div className="row filters">
        <input className="search" type="search" placeholder="Search by title" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} aria-label="Search creations" />
        <select className="select-sm" value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} aria-label="Filter by category">
          <option value="">All categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
      </div>
      <Alert>{error}</Alert>
      {loading ? <span className="spinner" /> : data.creations.length === 0 ? (
        <div className="empty"><p>{q || category ? 'Nothing matches those filters.' : 'No creations yet.'}</p>{!q && !category && <Link className="btn btn-primary" to="/create">Create your first one</Link>}</div>
      ) : (
        <div className="grid">{data.creations.map((c) => <CreationCard key={c.id} creation={c} />)}</div>
      )}
      {data.pages > 1 && (
        <div className="pager">
          <button className="btn btn-ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
          <span>Page {page} of {data.pages}</span>
          <button className="btn btn-ghost" disabled={page >= data.pages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}
    </>
  );
}
