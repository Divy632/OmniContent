import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api, { errorMessage } from '../services/api.js';

const CatalogContext = createContext(null);

// The content catalog (types, fields, options) comes from the server so new types need no client change.
export function CatalogProvider({ children }) {
  const [data, setData] = useState({ categories: [], types: [], meta: { tones: [], visualStyles: [], languages: [], platforms: [] } });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/content-types')
      .then((r) => setData(r.data))
      .catch((e) => setError(errorMessage(e)))
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(() => ({
    ...data, loading, error,
    getType: (id) => data.types.find((t) => t.id === id),
    categoryLabel: (id) => data.categories.find((c) => c.id === id)?.label || id,
  }), [data, loading, error]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export const useCatalog = () => useContext(CatalogContext);
