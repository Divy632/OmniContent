import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { catalogApi, creationApi, profileApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Sliders,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  Building2,
  Globe,
  Palette,
  Layers,
  HelpCircle
} from 'lucide-react';

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

const PLATFORMS = [
  'Instagram',
  'LinkedIn',
  'Twitter / X',
  'Facebook',
  'YouTube',
  'WhatsApp / Digital Card',
  'Print Poster / Flyer'
];

const VISUAL_STYLES = [
  'Modern Cyberpunk / Neon Tech',
  'Clean Minimalist Gradient',
  'Luxury Gold Foil & Elegant Dark',
  'Vibrant Celebration with Confetti',
  'Bold Commercial Product Showcase',
  'Cinematic High-Contrast Photo',
  'Modern Academic Tech Blueprint',
  'Retro Vintage Illustration'
];

export default function CreateFormPage() {
  const { contentType: typeId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [typeDef, setTypeDef] = useState(null);
  const [loadingType, setLoadingType] = useState(true);

  // Form states
  const [title, setTitle] = useState('');
  const [fieldValues, setFieldValues] = useState({});
  const [outputs, setOutputs] = useState(['text', 'image']);
  const [preferences, setPreferences] = useState({
    language: user?.preferences?.language || 'English',
    tone: user?.preferences?.tone || 'Professional & Authoritative',
    platform: 'Instagram',
    visualStyle: user?.preferences?.visualStyle || 'Modern Minimalist'
  });

  const [savedProfile, setSavedProfile] = useState(null);
  const [useProfileContext, setUseProfileContext] = useState(true);

  // Generation loading states
  const [generating, setGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);

  useEffect(() => {
    async function loadTypeAndProfile() {
      try {
        const [typeRes, profRes] = await Promise.all([
          catalogApi.getContentType(typeId),
          profileApi.getMe().catch(() => ({ profile: null }))
        ]);

        if (typeRes.contentType) {
          const t = typeRes.contentType;
          setTypeDef(t);
          setOutputs(t.defaultOutputs || t.supportedOutputs || ['text']);
          if (t.defaultPreferences) {
            setPreferences((prev) => ({
              ...prev,
              platform: t.defaultPreferences.platform || prev.platform,
              tone: t.defaultPreferences.tone || prev.tone,
              visualStyle: t.defaultPreferences.visualStyle || prev.visualStyle
            }));
          }
        }
        if (profRes?.profile) {
          setSavedProfile(profRes.profile);
        }
      } catch (err) {
        showToast(`Error: ${err.message}`, 'error');
        navigate('/create');
      } finally {
        setLoadingType(false);
      }
    }
    loadTypeAndProfile();
  }, [typeId]);

  const handleFieldChange = (fieldName, value) => {
    setFieldValues((prev) => ({ ...prev, [fieldName]: value }));
  };

  const toggleOutput = (outputType) => {
    setOutputs((prev) => {
      if (prev.includes(outputType)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter((o) => o !== outputType);
      } else {
        return [...prev, outputType];
      }
    });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast('Please enter a creation title or subject.', 'error');
      return;
    }

    setGenerating(true);
    setGenerationStep(1);

    // Animate generation steps for user feedback
    const stepTimer1 = setTimeout(() => setGenerationStep(2), 1200);
    const stepTimer2 = setTimeout(() => setGenerationStep(3), 2500);

    try {
      const payload = {
        contentCategory: typeDef.categoryId,
        contentType: typeDef.id,
        title: title.trim(),
        inputDetails: fieldValues,
        preferences,
        outputs
      };

      const result = await creationApi.generate(payload);
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      showToast('Generation completed successfully!', 'success');
      navigate(`/creations/${result.creation._id}`);
    } catch (err) {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setGenerating(false);
      showToast(err.message || 'Generation failed. Please try again.', 'error');
    }
  };

  if (loadingType) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-slate-400">
        <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
        <span className="text-xs">Loading form blueprint...</span>
      </div>
    );
  }

  if (generating) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-lg rounded-3xl glass-panel p-8 sm:p-10 border border-slate-800 text-center flex flex-col items-center shadow-2xl relative overflow-hidden">
          <div className="w-20 h-20 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center mb-6 relative">
            <Sparkles className="w-10 h-10 text-indigo-400 animate-pulse" />
            <div className="absolute inset-0 rounded-2xl border-2 border-indigo-400 border-t-transparent animate-spin" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">Synthesizing Creative Content</h2>
          <p className="text-xs text-slate-400 max-w-xs mb-8">
            Generating structured output for <span className="text-indigo-300 font-semibold">{typeDef.title}</span>
          </p>

          {/* Progress Timeline */}
          <div className="w-full space-y-3 text-left text-xs">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
              <CheckCircle2 className={`w-4 h-4 ${generationStep >= 1 ? 'text-emerald-400' : 'text-slate-600'}`} />
              <span className={generationStep >= 1 ? 'text-slate-200' : 'text-slate-500'}>
                1. Validating inputs & constructing prompt matrix
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
              <CheckCircle2 className={`w-4 h-4 ${generationStep >= 2 ? 'text-emerald-400' : 'text-slate-600'}`} />
              <span className={generationStep >= 2 ? 'text-slate-200' : 'text-slate-500'}>
                2. AI text engine orchestrating headline & copy
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
              <CheckCircle2 className={`w-4 h-4 ${generationStep >= 3 ? 'text-emerald-400' : 'text-slate-600'}`} />
              <span className={generationStep >= 3 ? 'text-slate-200' : 'text-slate-500'}>
                3. Rendering visual graphics & persisting to MongoDB
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8 pb-16">
      {/* Back button */}
      <div>
        <Link
          to="/create"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Catalog
        </Link>
      </div>

      {/* Form Header */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            {typeDef.categoryName}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{typeDef.title}</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">{typeDef.description}</p>
        </div>

        {/* Output Selector Toggles */}
        <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
          {typeDef.supportedOutputs.includes('text') && (
            <button
              type="button"
              onClick={() => toggleOutput('text')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                outputs.includes('text')
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Text Output
            </button>
          )}

          {typeDef.supportedOutputs.includes('image') && (
            <button
              type="button"
              onClick={() => toggleOutput('image')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                outputs.includes('image')
                  ? 'bg-pink-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              Visual Artwork
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleGenerate} className="flex flex-col gap-6">
        {/* Core Input Fields Section */}
        <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white">1. Structured Requirements</h2>
            <p className="text-xs text-slate-400">Fill in the factual details for this content type</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Creation Title / Main Objective <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. National Hackathon 2026 or Spring Product Launch"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Dynamic Content-Specific Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {typeDef.fields.map((field) => (
              <div
                key={field.name}
                className={field.type === 'textarea' ? 'md:col-span-2' : ''}
              >
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {field.label} {field.required && <span className="text-rose-400">*</span>}
                </label>

                {field.type === 'textarea' ? (
                  <textarea
                    rows={3}
                    required={field.required}
                    value={fieldValues[field.name] || ''}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                ) : (
                  <input
                    type="text"
                    required={field.required}
                    value={fieldValues[field.name] || ''}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Preferences Section (Section 12.1) */}
        <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white">2. Language & Output Styling</h2>
            <p className="text-xs text-slate-400">Configure target tone, language, visual aesthetics, and platform</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Language</label>
              <select
                value={preferences.language}
                onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 outline-none focus:border-indigo-500"
              >
                {LANGUAGES.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Writing Tone</label>
              <select
                value={preferences.tone}
                onChange={(e) => setPreferences({ ...preferences, tone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 outline-none focus:border-indigo-500"
              >
                {TONES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Platform Target</label>
              <select
                value={preferences.platform}
                onChange={(e) => setPreferences({ ...preferences, platform: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 outline-none focus:border-indigo-500"
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Visual Art Style</label>
              <select
                value={preferences.visualStyle}
                onChange={(e) => setPreferences({ ...preferences, visualStyle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 outline-none focus:border-indigo-500"
              >
                {VISUAL_STYLES.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Optional Brand Profile Integration (Section 5.2 & 11.7) */}
          {savedProfile?.name && (
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-indigo-400" />
                <div>
                  <span className="text-xs font-semibold text-slate-200 block">
                    Saved Brand Profile: {savedProfile.name}
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Inject saved logo, color scheme, and organization context into generation
                  </span>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={useProfileContext}
                  onChange={(e) => setUseProfileContext(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-4">
          <Link
            to="/create"
            className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-sm font-medium border border-slate-800"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <Sparkles className="w-4 h-4" />
            Generate Content & Visuals
          </button>
        </div>
      </form>
    </div>
  );
}
