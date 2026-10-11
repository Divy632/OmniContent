import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCatalog } from '../context/CatalogContext.jsx';
import api, { errorMessage } from '../services/api.js';
import Alert from '../components/Alert.jsx';
import { cap } from '../utils/format.js';

export default function Preferences() {
  const { user, setUser } = useAuth();
  const { meta } = useCatalog();
  const [form, setForm] = useState(user.preferences);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => { setForm({ ...form, [k]: e.target.value }); setSaved(false); };

  async function submit(e) {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      const { data } = await api.put('/profiles/me/preferences', form);
      setUser(data.user); setSaved(true);
    } catch (err) { setError(errorMessage(err, 'Could not save your preferences.')); } finally { setBusy(false); }
  }

  return (
    <>
      <div className="page-head"><div><h1>Preferences</h1><p className="muted">These fill in the language, tone and style on every new creation. You can change them for any single creation.</p></div></div>
      <form className="panel form-grid" onSubmit={submit}>
        <Alert>{error}</Alert>
        <Alert kind="success">{saved ? 'Preferences saved.' : ''}</Alert>
        <label>Language<select value={form.language} onChange={set('language')}>{meta.languages.map((l) => <option key={l}>{l}</option>)}</select></label>
        <label>Tone<select value={form.tone} onChange={set('tone')}>{meta.tones.map((t) => <option key={t} value={t}>{cap(t)}</option>)}</select></label>
        <label>Visual style<select value={form.visualStyle} onChange={set('visualStyle')}>{meta.visualStyles.map((s) => <option key={s} value={s}>{cap(s)}</option>)}</select></label>
        <div className="wide"><button className="btn btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save preferences'}</button></div>
      </form>
    </>
  );
}
