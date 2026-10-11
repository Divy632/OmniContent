import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import api, { errorMessage } from '../services/api.js';
import { useCatalog } from '../context/CatalogContext.jsx';
import Alert from '../components/Alert.jsx';
import { FIELD_LABELS, formatDate } from '../utils/format.js';

function CopyButton({ text }) {
  const [done, setDone] = useState(false);
  if (!text) return null;
  async function copy() {
    try { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1500); } catch { /* clipboard blocked */ }
  }
  return <button type="button" className="btn-link" onClick={copy}>{done ? 'Copied' : 'Copy'}</button>;
}

const toDraft = (t = {}) => ({ ...t, hashtags: (t.hashtags || []).join(' ') });

export default function CreationDetail() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { getType } = useCatalog();
  const [c, setC] = useState(null);
  const [draft, setDraft] = useState({});
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState(state?.fresh ? 'Your creation is ready and saved. You can edit the text below.' : '');
  const [busy, setBusy] = useState('');

  useEffect(() => {
    api.get(`/creations/${id}`)
      .then((r) => { setC(r.data.creation); setDraft(toDraft(r.data.creation.generatedText)); setTitle(r.data.creation.title); })
      .catch((e) => setError(e.response?.status === 404 ? 'We could not find that creation.' : errorMessage(e)));
  }, [id]);

  const type = c ? getType(c.contentType) : null;
  const fields = useMemo(() => (type?.textFields || []).filter((k) => c?.generatedText && k in c.generatedText), [type, c]);
  const dirty = c && (title !== c.title || JSON.stringify(draft) !== JSON.stringify(toDraft(c.generatedText)));

  async function save() {
    setBusy('save'); setError(''); setNotice('');
    try {
      const generatedText = {};
      fields.forEach((k) => { generatedText[k] = k === 'hashtags' ? draft.hashtags.split(/\s+/).filter(Boolean).map((h) => (h.startsWith('#') ? h : `#${h}`)) : (draft[k] || ''); });
      const { data } = await api.put(`/creations/${id}`, { title: title.trim(), generatedText });
      setC(data.creation); setDraft(toDraft(data.creation.generatedText)); setTitle(data.creation.title); setNotice('Changes saved.');
    } catch (err) { setError(errorMessage(err, 'Could not save your changes.')); } finally { setBusy(''); }
  }

  async function download() {
    setBusy('download'); setError('');
    try {
      const res = await api.get(`/creations/${id}/download`, { responseType: 'blob' });
      const ext = { 'image/svg+xml': 'svg', 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp' }[res.data.type] || 'png';
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url; a.download = `${c.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.${ext}`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) { setError(errorMessage(err, 'Could not download the image.')); } finally { setBusy(''); }
  }

  async function regenerate(outputs, label) {
    if (dirty && !window.confirm('You have unsaved edits. Regenerating will replace them. Continue?')) return;
    if (!window.confirm(`Regenerate the ${label}? The current ${label} will be replaced.`)) return;
    setBusy('regen'); setError(''); setNotice('');
    try {
      const { data } = await api.post(`/creations/${id}/regenerate`, { outputs });
      setC(data.creation); setDraft(toDraft(data.creation.generatedText)); setNotice('Regenerated.');
    } catch (err) { setError(errorMessage(err, 'Unable to generate content right now.')); } finally { setBusy(''); }
  }

  async function remove() {
    if (!window.confirm('Delete this creation? This cannot be undone.')) return;
    setBusy('delete');
    try { await api.delete(`/creations/${id}`); navigate('/creations', { replace: true }); }
    catch (err) { setError(errorMessage(err)); setBusy(''); }
  }

  if (!c) return error ? <><Alert>{error}</Alert><Link to="/creations" className="btn btn-ghost">Back to my creations</Link></> : <span className="spinner" />;

  const hasText = c.outputs.includes('text');
  const hasImage = c.outputs.includes('image') && c.imageUrl;
  const demo = c.outputMetadata?.providers?.image === 'mock' || c.outputMetadata?.providers?.text === 'mock';
  const allText = fields.map((k) => draft[k]).filter(Boolean).join('\n\n');

  return (
    <>
      <div className="page-head">
        <div><h1>{c.title}</h1><p className="muted">{type?.label || c.contentType} · {formatDate(c.createdAt)}</p></div>
        <Link to="/creations" className="btn-link">All creations</Link>
      </div>

      <Alert>{error}</Alert>
      <Alert kind="success">{notice}</Alert>
      {demo && <Alert kind="info">Some of this is demo output generated locally. Set TEXT_PROVIDER and IMAGE_PROVIDER in server/.env to use real AI.</Alert>}

      <div className={hasImage ? 'detail' : 'stack'}>
        {hasImage && (
          <div className="detail-img">
            <img src={c.imageUrl} alt={`Visual for ${c.title}`} />
            <div className="row">
              <button className="btn btn-primary" onClick={download} disabled={!!busy}>{busy === 'download' ? 'Preparing…' : 'Download image'}</button>
              <button className="btn btn-ghost" onClick={() => regenerate(['image'], 'image')} disabled={!!busy}>New image</button>
            </div>
          </div>
        )}

        <div className="stack">
          {hasText && (
            <div className="panel">
              <div className="row between"><h2>Text</h2><CopyButton text={allText} /></div>
              <label className="field-edit">Title<input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} /></label>
              {fields.map((k) => (
                <label key={k} className="field-edit">
                  <span className="copy-head"><span>{FIELD_LABELS[k] || k}</span><CopyButton text={draft[k]} /></span>
                  {k === 'headline' || k === 'cta' || k === 'hashtags'
                    ? <input value={draft[k] || ''} onChange={(e) => setDraft({ ...draft, [k]: e.target.value })} />
                    : <textarea rows={k === 'body' ? 9 : 4} value={draft[k] || ''} onChange={(e) => setDraft({ ...draft, [k]: e.target.value })} />}
                </label>
              ))}
              <div className="row">
                <button className="btn btn-primary" onClick={save} disabled={!dirty || !!busy}>{busy === 'save' ? 'Saving…' : 'Save changes'}</button>
                <button className="btn btn-ghost" onClick={() => regenerate(['text'], 'text')} disabled={!!busy}>{busy === 'regen' ? 'Generating…' : 'New text'}</button>
              </div>
            </div>
          )}

          {!hasText && <div className="panel"><label className="field-edit">Title<input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} /></label><button className="btn btn-primary" onClick={save} disabled={!dirty || !!busy}>Save title</button></div>}

          <div className="panel">
            <h2>Details you provided</h2>
            <dl className="facts">
              {(type?.fields || []).filter((f) => c.inputDetails?.[f.name]).map((f) => (<div key={f.name} className="fact"><dt>{f.label}</dt><dd>{c.inputDetails[f.name]}</dd></div>))}
              <div className="fact"><dt>Language</dt><dd>{c.preferences?.language}</dd></div>
              <div className="fact"><dt>Tone</dt><dd>{c.preferences?.tone}</dd></div>
              {c.preferences?.platform && <div className="fact"><dt>Platform</dt><dd>{c.preferences.platform}</dd></div>}
              {c.preferences?.visualStyle && hasImage && <div className="fact"><dt>Visual style</dt><dd>{c.preferences.visualStyle}</dd></div>}
            </dl>
          </div>

          <div className="row between">
            <button className="btn btn-danger" onClick={remove} disabled={!!busy}>Delete</button>
            <p className="muted small">Review AI-generated content for accuracy before you publish it.</p>
          </div>
        </div>
      </div>
    </>
  );
}
