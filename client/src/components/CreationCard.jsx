import { Link } from 'react-router-dom';
import { useCatalog } from '../context/CatalogContext.jsx';
import { formatDate } from '../utils/format.js';

export default function CreationCard({ creation }) {
  const { getType } = useCatalog();
  const t = creation.generatedText || {};
  const snippet = t.headline || t.caption || t.body || '';
  return (
    <Link to={`/creations/${creation.id}`} className="ccard">
      {creation.imageUrl ? (
        <div className="ccard-img"><img src={creation.imageUrl} alt={`Visual for ${creation.title}`} loading="lazy" /></div>
      ) : (
        <div className="ccard-img snippet"><p>{snippet.slice(0, 160)}</p></div>
      )}
      <div className="ccard-body">
        <h3>{creation.title}</h3>
        <p className="meta">{getType(creation.contentType)?.label || creation.contentType} · {formatDate(creation.createdAt)}</p>
      </div>
    </Link>
  );
}
