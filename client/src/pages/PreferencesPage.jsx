import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { Sliders, Save, CheckCircle2, Globe, Sparkles } from 'lucide-react';

const LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'German',
  'Hindi',
  'Japanese',
  'Portuguese',
  'Italian'
];

const TONES = [
  'Professional & Authoritative',
  'Casual & Friendly',
  'Energetic & High-Spirited',
  'Inspiring & Uplifting',
  'Persuasive & Urgent',
  'Warm & Celebratory',
  'Sophisticated & Elegant',
  'Technical & Precise'
];

const VISUAL_STYLES = [
  'Modern Minimalist Gradient',
  'Modern Cyberpunk / Neon Tech',
  'Luxury Gold Foil & Elegant Dark',
  'Vibrant Celebration with Confetti',
  'Bold Commercial Product Showcase',
  'Cinematic High-Contrast Photo',
  'Modern Academic Tech Blueprint',
  'Retro Vintage Illustration'
];

export default function PreferencesPage() {
  const { user, updatePreferences } = useAuth();
  const { showToast } = useToast();

  const [language, setLanguage] = useState(user?.preferences?.language || 'English');
  const [tone, setTone] = useState(user?.preferences?.tone || 'Professional & Authoritative');
  const [visualStyle, setVisualStyle] = useState(user?.preferences?.visualStyle || 'Modern Minimalist Gradient');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updatePreferences({ language, tone, visualStyle });
      showToast('Global preferences updated successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to save preferences', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-8 pb-16">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
          <Sliders className="w-3.5 h-3.5" />
          User Defaults & Regional Settings
        </div>
        <h1 className="text-3xl font-bold text-white">Default Content Preferences</h1>
        <p className="text-xs text-slate-400 mt-1">
          Set your preferred language, tone of voice, and visual style. These presets will auto-populate your creation forms.
        </p>
      </div>

      <form onSubmit={handleSave} className="rounded-3xl glass-panel p-6 sm:p-8 border border-slate-800 space-y-6">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-indigo-400" />
            Default Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-200 outline-none focus:border-indigo-500"
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-slate-500 mt-1">AI copy will be natively drafted in this target language.</p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Default Writing Tone
          </label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-200 outline-none focus:border-indigo-500"
          >
            {TONES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-slate-500 mt-1">Controls the vocabulary, rhythm, and persuasion style of the AI text.</p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-pink-400" />
            Default Visual Aesthetic
          </label>
          <select
            value={visualStyle}
            onChange={(e) => setVisualStyle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-200 outline-none focus:border-indigo-500"
          >
            {VISUAL_STYLES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-slate-500 mt-1">Used to synthesize poster themes and image generator prompts.</p>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Default Preferences'}
          </button>
        </div>
      </form>
    </div>
  );
}
