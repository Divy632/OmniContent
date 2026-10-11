import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api, { errorMessage } from '../services/api.js';
import Alert from '../components/Alert.jsx';

const empty = { profileType: 'business', name: '', description: '', website: '', contactEmail: '', contactPhone: '', instagram: '', facebook: '', linkedin: '' };

export default function Profile() {
  const { profile, refreshProfile } = useAuth();
  const [form, setForm] = useState(empty);
  const [colors, setColors] = useState(['#1b2a41']);
  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setForm({
      profileType: profile.profileType, name: profile.name, description: profile.description || '', website: profile.website || '',
      contactEmail: profile.contact?.email || '', contactPhone: profile.contact?.phone || '',
      instagram: profile.socialLinks?.instagram || '', facebook: profile.socialLinks?.facebook || '', linkedin: profile.socialLinks?.linkedin || '',
    });
    setColors(profile.brandColors?.length ? profile.brandColors : ['#1b2a41']);
    setPreview(profile.logoUrl || '');
  }, [profile]);

  const set = (k) => (e) => { setForm({ ...form, [k]: e.target.value }); setSaved(false); };

  function pickLogo(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) { setError('Logo must be a PNG, JPG or WebP image.'); return; }
    if (file.size > 2 * 1024 * 1024) { setError('Logo must be smaller than 2 MB.'); return; }
    setError(''); setLogo(file); setPreview(URL.createObjectURL(file)); setSaved(false);
  }

  async function submit(e) {
    e.preventDefault();
    setError(''); setSaved(false);
    if (form.name.trim().length < 2) { setError('Enter a name for this profile.'); return; }
    const body = new FormData();
    Object.entries(form).forEach(([k, v]) => body.append(k, v));
    body.append('brandColors', colors.join(','));
    if (logo) body.append('logo', logo);
    setBusy(true);
    try {
      await api.put('/profiles/me', body);
      await refreshProfile(); setLogo(null); setSaved(true);
    } catch (err) { setError(errorMessage(err, 'Could not save your profile.')); } finally { setBusy(false); }
  }

  async function remove() {
    if (!window.confirm('Delete your saved profile? Your creations are not affected.')) return;
    try { await api.delete('/profiles/me'); await refreshProfile(); setForm(empty); setPreview(''); setColors(['#1b2a41']); }
    catch (err) { setError(errorMessage(err)); }
  }

  return (
    <>
      <div className="page-head"><div><h1>Profile</h1><p className="muted">Optional. Save a logo, brand colors and a short description to reuse in business, event and promotion content. You can create content without one.</p></div></div>
      <form className="panel form-grid" onSubmit={submit} noValidate>
        <Alert>{error}</Alert>
        <Alert kind="success">{saved ? 'Profile saved. It will be used where a content type benefits from it.' : ''}</Alert>

        <fieldset className="choice-row">
          <legend>This profile is for</legend>
          {[['personal', 'Me'], ['business', 'A business'], ['organization', 'An organization']].map(([v, l]) => (
            <label key={v} className={`choice ${form.profileType === v ? 'on' : ''}`}>
              <input type="radio" name="profileType" value={v} checked={form.profileType === v} onChange={set('profileType')} />{l}
            </label>
          ))}
        </fieldset>

        <label className="wide">Name<input value={form.name} onChange={set('name')} maxLength={120} required /></label>
        <label className="wide">About<textarea rows={3} value={form.description} onChange={set('description')} maxLength={800} placeholder="One or two lines on what you do." /></label>

        <div className="wide">
          <span className="label">Brand colors</span>
          <div className="colors">
            {colors.map((c, i) => (
              <span className="color" key={i}>
                <input type="color" aria-label={`Brand color ${i + 1}`} value={c} onChange={(e) => { const n = [...colors]; n[i] = e.target.value; setColors(n); setSaved(false); }} />
                <code>{c}</code>
                {colors.length > 1 && <button type="button" className="btn-link" onClick={() => setColors(colors.filter((_, j) => j !== i))}>Remove</button>}
              </span>
            ))}
            {colors.length < 4 && <button type="button" className="btn btn-ghost btn-sm" onClick={() => setColors([...colors, '#f4a300'])}>Add color</button>}
          </div>
        </div>

        <div className="wide logo-row">
          {preview ? <img src={preview} alt="Logo preview" className="logo-preview" /> : <div className="logo-preview logo-empty">No logo</div>}
          <label>Logo (PNG, JPG or WebP, up to 2 MB)<input type="file" accept="image/png,image/jpeg,image/webp" onChange={pickLogo} /></label>
        </div>

        <label>Contact email<input type="email" value={form.contactEmail} onChange={set('contactEmail')} /></label>
        <label>Contact phone<input value={form.contactPhone} onChange={set('contactPhone')} maxLength={30} /></label>
        <label>Website<input value={form.website} onChange={set('website')} placeholder="https://" maxLength={200} /></label>
        <label>Instagram<input value={form.instagram} onChange={set('instagram')} placeholder="@handle" /></label>
        <label>Facebook<input value={form.facebook} onChange={set('facebook')} /></label>
        <label>LinkedIn<input value={form.linkedin} onChange={set('linkedin')} /></label>

        <div className="wide row">
          <button className="btn btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save profile'}</button>
          {profile && <button type="button" className="btn btn-danger" onClick={remove}>Delete profile</button>}
        </div>
      </form>
    </>
  );
}
