import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { creationApi } from '../services/api';
import { useToast } from '../components/Toast';
import PosterCanvas from '../components/PosterCanvas';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  ArrowLeft,
  Copy,
  Check,
  Save,
  RefreshCw,
  Trash2,
  Share2,
  Download,
  FileText,
  Tag,
  Clock,
  Layers,
  Edit2
} from 'lucide-react';

export default function CreationResultPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [creation, setCreation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);

  // Editable text states
  const [headline, setHeadline] = useState('');
  const [caption, setCaption] = useState('');
  const [description, setDescription] = useState('');
  const [cta, setCta] = useState('');
  const [hashtags, setHashtags] = useState([]);
  const [hashtagInput, setHashtagInput] = useState('');

  // Regeneration modal state
  const [showRegenModal, setShowRegenModal] = useState(false);
  const [tweakInstructions, setTweakInstructions] = useState('');
  const [regenOutputs, setRegenOutputs] = useState(['text', 'image']);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    async function loadCreation() {
      try {
        const data = await creationApi.getById(id);
        if (data.creation) {
          const c = data.creation;
          setCreation(c);
          setHeadline(c.generatedText?.headline || '');
          setCaption(c.generatedText?.caption || '');
          setDescription(c.generatedText?.description || '');
          setCta(c.generatedText?.cta || '');
          setHashtags(c.generatedText?.hashtags || []);
        }
      } catch (err) {
        showToast(err.message || 'Failed to load creation', 'error');
        navigate('/creations');
      } finally {
        setLoading(false);
      }
    }
    loadCreation();
  }, [id]);

  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast('Copied to clipboard!', 'success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCopyAll = () => {
    const fullContent = `
${headline}

${caption}

${description}

CTA: ${cta}

Tags: ${hashtags.join(' ')}
    `.trim();

    navigator.clipboard.writeText(fullContent);
    showToast('All content copied to clipboard!', 'success');
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 }
    });
  };

  const handleSaveEdits = async () => {
    setSaving(true);
    try {
      const updated = await creationApi.update(id, {
        generatedText: {
          headline,
          caption,
          description,
          cta,
          hashtags
        }
      });
      setCreation(updated.creation);
      showToast('Edits successfully saved to database!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to save edits', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const res = await creationApi.regenerate(id, {
        outputs: regenOutputs,
        tweakInstructions
      });
      const c = res.creation;
      setCreation(c);
      setHeadline(c.generatedText?.headline || '');
      setCaption(c.generatedText?.caption || '');
      setDescription(c.generatedText?.description || '');
      setCta(c.generatedText?.cta || '');
      setHashtags(c.generatedText?.hashtags || []);
      setShowRegenModal(false);
      setTweakInstructions('');
      showToast('Content successfully regenerated!', 'success');
    } catch (err) {
      showToast(err.message || 'Regeneration failed', 'error');
    } finally {
      setRegenerating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to permanently delete this creation?')) {
      return;
    }
    try {
      await creationApi.delete(id);
      showToast('Creation removed.', 'info');
      navigate('/creations');
    } catch (err) {
      showToast(err.message || 'Failed to delete creation', 'error');
    }
  };

  const addHashtag = (e) => {
    if (e.key === 'Enter' && hashtagInput.trim()) {
      e.preventDefault();
      let tag = hashtagInput.trim();
      if (!tag.startsWith('#')) tag = `#${tag}`;
      if (!hashtags.includes(tag)) {
        setHashtags([...hashtags, tag]);
      }
      setHashtagInput('');
    }
  };

  const removeHashtag = (tagToRemove) => {
    setHashtags(hashtags.filter((t) => t !== tagToRemove));
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-slate-400">
        <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
        <span className="text-xs">Loading creation details...</span>
      </div>
    );
  }

  if (!creation) return null;

  return (
    <div className="flex flex-col gap-6 pb-16">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/creations"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                {creation.contentCategory} • {creation.contentType.replace('_', ' ')}
              </span>
              <span className="text-[10px] text-slate-500">
                Created on {new Date(creation.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white line-clamp-1">{creation.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowRegenModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-indigo-500/20 text-xs font-semibold transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Regenerate
          </button>
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold transition-colors"
          >
            <Copy className="w-3.5 h-3.5 text-cyan-400" />
            Copy All
          </button>
          <button
            onClick={handleSaveEdits}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? 'Saving...' : 'Save Edits'}
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
            title="Delete this creation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main 2-Column Responsive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Visual Artwork & Poster Canvas (lg: 5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="rounded-3xl glass-panel p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                Visual Output & Poster Canvas
              </span>
              <span className="text-[10px] text-slate-400">
                {creation.outputMetadata?.dimensions?.aspectRatio || 'Multi-Platform'}
              </span>
            </div>

            {/* Poster Canvas Component */}
            <PosterCanvas
              title={creation.title}
              headline={headline}
              details={creation.inputDetails || {}}
              imageUrl={creation.imageUrl}
              category={creation.contentCategory}
              aspectRatio={creation.outputMetadata?.dimensions?.aspectRatio || '3:4'}
            />
          </div>

          {/* Input details inspector */}
          <div className="rounded-2xl glass-card p-5 border border-slate-800 text-xs space-y-3">
            <span className="font-semibold text-slate-300 block">Supplied Parameters</span>
            <div className="space-y-1.5 text-slate-400">
              {Object.entries(creation.inputDetails || {}).map(([key, val]) => (
                <div key={key} className="flex justify-between gap-2 border-b border-slate-800/50 pb-1">
                  <span className="capitalize text-slate-500">{key}:</span>
                  <span className="text-slate-300 text-right font-medium max-w-[200px] truncate">{String(val)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Structured Text Live Editor (lg: 7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  Structured Content Editor
                </h2>
                <p className="text-xs text-slate-400">
                  Review and customize your generated text. Click Copy buttons for fast clipboard access.
                </p>
              </div>
              <span className="text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                Interactive Mode
              </span>
            </div>

            {/* 1. Headline */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Headline / Title</label>
                <button
                  onClick={() => handleCopy(headline, 'headline')}
                  className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  {copiedKey === 'headline' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedKey === 'headline' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm font-bold text-white focus:border-indigo-500 outline-none"
              />
            </div>

            {/* 2. Caption */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Social Caption / Executive Hook</label>
                <button
                  onClick={() => handleCopy(caption, 'caption')}
                  className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  {copiedKey === 'caption' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedKey === 'caption' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <textarea
                rows={2}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:border-indigo-500 outline-none"
              />
            </div>

            {/* 3. Description / Full Body Narrative */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Complete Description & Event Details</label>
                <button
                  onClick={() => handleCopy(description, 'desc')}
                  className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  {copiedKey === 'desc' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedKey === 'desc' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <textarea
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans focus:border-indigo-500 outline-none"
              />
            </div>

            {/* 4. Call to Action */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Call to Action (CTA)</label>
                <button
                  onClick={() => handleCopy(cta, 'cta')}
                  className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  {copiedKey === 'cta' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedKey === 'cta' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <input
                type="text"
                value={cta}
                onChange={(e) => setCta(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-indigo-300 focus:border-indigo-500 outline-none"
              />
            </div>

            {/* 5. Hashtags */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  Hashtags
                </label>
                <button
                  onClick={() => handleCopy(hashtags.join(' '), 'tags')}
                  className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  {copiedKey === 'tags' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedKey === 'tags' ? 'Copied' : 'Copy All Tags'}
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono"
                  >
                    {tag}
                    <button
                      onClick={() => removeHashtag(tag)}
                      className="text-indigo-400 hover:text-rose-400 text-sm ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <input
                type="text"
                value={hashtagInput}
                onChange={(e) => setHashtagInput(e.target.value)}
                onKeyDown={addHashtag}
                placeholder="Type tag & press Enter (e.g. #Hackathon2026)"
                className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 placeholder:text-slate-600 focus:border-indigo-500 outline-none"
              />
            </div>

            {/* Save Edits button */}
            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={handleSaveEdits}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Edits to MongoDB'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Regeneration Modal */}
      {showRegenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl glass-panel p-6 border border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-indigo-400" />
                Regenerate Content
              </h3>
              <button
                onClick={() => setShowRegenModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Output Targets to Regenerate:
              </label>
              <div className="flex items-center gap-3 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={regenOutputs.includes('text')}
                    onChange={(e) => {
                      if (e.target.checked) setRegenOutputs([...regenOutputs, 'text']);
                      else if (regenOutputs.length > 1) setRegenOutputs(regenOutputs.filter((o) => o !== 'text'));
                    }}
                    className="accent-indigo-500"
                  />
                  <span>Text Narrative</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={regenOutputs.includes('image')}
                    onChange={(e) => {
                      if (e.target.checked) setRegenOutputs([...regenOutputs, 'image']);
                      else if (regenOutputs.length > 1) setRegenOutputs(regenOutputs.filter((o) => o !== 'image'));
                    }}
                    className="accent-indigo-500"
                  />
                  <span>Visual Artwork</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Optional Tweak Instructions (e.g. "make it more energetic", "mention free food"):
              </label>
              <textarea
                rows={3}
                value={tweakInstructions}
                onChange={(e) => setTweakInstructions(e.target.value)}
                placeholder="e.g. Focus more on the cash prize pool and add more excitement!"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowRegenModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleRegenerate}
                disabled={regenerating}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${regenerating ? 'animate-spin' : ''}`} />
                {regenerating ? 'Regenerating...' : 'Regenerate Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
