import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCatalog } from '../context/CatalogContext.jsx';
import TypePicker from '../components/TypePicker.jsx';
import Alert from '../components/Alert.jsx';

export default function Create() {
  const { categories, error } = useCatalog();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const category = params.get('category') || '';

  return (
    <>
      <div className="page-head"><div><h1>Create content</h1><p className="muted">Choose what you want to make.</p></div></div>
      <Alert>{error}</Alert>
      <input className="search" type="search" placeholder="Search content types" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search content types" />
      <div className="chips tabs" role="group" aria-label="Filter by category">
        <button className={`chip ${!category ? 'on' : ''}`} onClick={() => setParams({})}>All</button>
        {categories.map((c) => (
          <button key={c.id} className={`chip ${category === c.id ? 'on' : ''}`} onClick={() => setParams({ category: c.id })}>{c.label}</button>
        ))}
      </div>
      <TypePicker category={category} query={query} />
    </>
  );
}
