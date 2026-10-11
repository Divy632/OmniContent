import { Link } from 'react-router-dom';
import { useCatalog } from '../context/CatalogContext.jsx';

// Grouped content-type cards. Filters by category id and free-text query.
export default function TypePicker({ category = '', query = '' }) {
  const { categories, types } = useCatalog();
  const q = query.trim().toLowerCase();
  const visible = types.filter((t) => (!category || t.category === category) && (!q || `${t.label} ${t.description}`.toLowerCase().includes(q)));
  if (!visible.length) return <div className="empty"><p>No content types match that search.</p></div>;

  return (
    <div className="stack">
      {categories.map((c) => {
        const list = visible.filter((t) => t.category === c.id);
        if (!list.length) return null;
        return (
          <section key={c.id}>
            <h2 className="cat-title">{c.label}</h2>
            <div className="tgrid">
              {list.map((t) => (
                <Link key={t.id} to={`/create/${t.id}`} className="tcard">
                  <strong>{t.label}</strong>
                  <span>{t.description}</span>
                  <em>{t.supportedOutputs.includes('image') ? (t.supportedOutputs.includes('text') ? 'Text + visual' : 'Visual') : 'Text'}</em>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
