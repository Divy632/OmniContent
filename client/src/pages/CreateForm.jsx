import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCatalog } from '../context/CatalogContext.jsx';
import api, { errorMessage } from '../services/api.js';
import Alert from '../components/Alert.jsx';
import { cap } from '../utils/format.js';

const STAGES = ['Checking your details…', 'Writing the text…', 'Designing the visual…', 'Saving your creation…'];

export default function CreateForm() {
  const { contentType } = useParams();
  const { user, profile } = useAuth();
  const { getType, meta, loading } = useCatalog();
  const navigate = useNavigate();
  const type = getType(contentType);

  const [input, setInput] = useState({});
  const [title, setTitle] = useState('');
  const [prefs, setPrefs] = useState({ language: user.preferences.language, tone: user.preferences.tone, visualStyle: user.preferences.visualStyle, platform: '', useProfile: true });
  const [outputs, setOutputs] = useState([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState(0);

  useEffect(() => { if (type) setOutputs(type.defaultOutputs); }, [type]);
  useEffect(() => {
    if (!busy) return undefined;
    setStage(0);
    const t = setInterval(() => setStage((s) => Math.min(s + 1, STAGES.length - 1)), 6000);
    return () => clearInterval(t);
  }, [busy]);

  if (loading) return <span className="spinner" />;
  if (!type) return <div className="empty"><h1>Content type not found</h1><Link className="btn btn-primary" to="/create">Choose a content type</Link></div>;

  const setField = (name) => (e) => setInput({ ...input, [name]: e.target.value });
  const setPref = (k) => (e) => setPrefs({ ...prefs, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const toggleOutput = (o) => setOutputs(outputs.includes(o) ? outputs.filter((x) => x !== o) : [...outputs, o]);
  const wantsImage = outputs.includes('image');

  async function submit(e) {
    e.preventDefault();
    setError('');
    const missing = type.fields.find((f) => f.required && !(input[f.name] || '').trim());
    if (missing) { setError(`${missing.label} is required.`); return; }
    if (outputs.length === 0) { setError('Choose text, a visual, or both.'); return; }
    const preferences = { language: prefs.language, tone: prefs.tone, useProfile: prefs.useProfile };
    if (type.showPlatform && prefs.platform) preferences.platform = prefs.platform;
    if (wantsImage && type.showVisualStyle) preferences.visualStyle = prefs.visualStyle;
    setBusy(true);
    try {
      const { data } = await api.post('/creations/generate', { contentType: type.id, title: title.trim() || undefined, inputDetails: input, preferences, outputs });
      navigate(`/creations/${data.creation.id}`, { state: { fresh: true } });
    } catch (err) {
      setError(errorMessage(err, 'Unable to generate content right now.'));
      setBusy(false);
    }
  }

  return (
    <>
      <div className="page-head">
        <div><h1>{type.label}</h1><p className="muted">{type.description}</p></div>
        <Link to="/create" className="btn-link">Change type</Link>
      </div>

      <form className="stack" onSubmit={submit} noValidate>
        <Alert>{error}</Alert>

        <fieldset className="panel form-grid">
          <legend>Details</legend>
          {type.fields.map((f) => (
            <label key={f.name} className={f.type === 'textarea' || type.fields.length < 3 ? 'wide' : ''}>
              {f.label}{f.required ? '' : ' (optional)'}
              {f.type === 'textarea'
                ? <textarea rows={3} value={input[f.name] || ''} onChange={setField(f.name)} maxLength={f.max} placeholder={f.placeholder} />
                : <input value={input[f.name] || ''} onChange={setField(f.name)} maxLength={f.max} placeholder={f.placeholder} />}
            </label>
          ))}
          <label className="wide">Title for your records (optional)<input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} placeholder="We will name it for you if you leave this empty" /></label>
        </fieldset>

        <fieldset className="panel form-grid">
          <legend>Preferences</legend>
          <label>Language<select value={prefs.language} onChange={setPref('language')}>{[...new Set([prefs.language, ...meta.languages])].map((l) => <option key={l}>{l}</option>)}</select></label>
          <label>Tone<select value={prefs.tone} onChange={setPref('tone')}>{meta.tones.map((t) => <option key={t} value={t}>{cap(t)}</option>)}</select></label>
          {type.showPlatform && (
            <label>Platform<select value={prefs.platform} onChange={setPref('platform')}><option value="">Not specific</option>{meta.platforms.map((p) => <option key={p}>{p}</option>)}</select></label>
          )}
          {type.showVisualStyle && wantsImage && (
            <label>Visual style<select value={prefs.visualStyle} onChange={setPref('visualStyle')}>{meta.visualStyles.map((s) => <option key={s} value={s}>{cap(s)}</option>)}</select></label>
          )}
          <div className="wide">
            <span className="label">What should we create?</span>
            <div className="chips">
              {type.supportedOutputs.map((o) => (
                <label key={o} className={`chip ${outputs.includes(o) ? 'on' : ''}`}>
                  <input type="checkbox" checked={outputs.includes(o)} onChange={() => toggleOutput(o)} />{o === 'text' ? 'Text' : 'Visual'}
                </label>
              ))}
            </div>
          </div>
          {type.profileRelevant && (
            <div className="wide">
              {profile ? (
                <label className="check"><input type="checkbox" checked={prefs.useProfile} onChange={setPref('useProfile')} />Use my profile ({profile.name}) for brand context</label>
              ) : (
                <p className="muted small">Optional: save a <Link to="/profile">profile</Link> with your logo and brand colors to reuse them here.</p>
              )}
            </div>
          )}
        </fieldset>

        <div><button className="btn btn-primary btn-lg" disabled={busy}>Generate</button></div>
      </form>

      {busy && (
        <div className="overlay" role="status" aria-live="polite">
          <div className="overlay-card">
            <span className="spinner" />
            <h2>Creating your content</h2>
            <p>{STAGES[stage]}</p>
            <p className="muted">This can take up to a minute. Please keep this page open.</p>
          </div>
        </div>
      )}
    </>
  );
}
