import React, { useState, useEffect } from 'react';
import { profileApi } from '../services/api';
import { useToast } from '../components/Toast';
import {
  Building2,
  Save,
  Globe,
  Palette,
  Mail,
  Phone,
  Share2,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

const PROFILE_TYPES = [
  { id: 'individual', label: 'Individual / Personal Creator' },
  { id: 'student', label: 'Student / College Club' },
  { id: 'business', label: 'Business / Company' },
  { id: 'organization', label: 'Non-Profit / NGO / Institute' },
  { id: 'creator', label: 'YouTuber / Digital Influencer' },
  { id: 'other', label: 'Other Enterprise' }
];

export default function ProfilePage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    profileType: 'student',
    name: '',
    description: '',
    logoUrl: '',
    brandColors: ['#4f46e5', '#06b6d4'],
    contact: { email: '', phone: '' },
    website: '',
    socialLinks: { instagram: '', linkedin: '', twitter: '', youtube: '' }
  });

  const [colorInput, setColorInput] = useState('#4f46e5');

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await profileApi.getMe();
        if (data.profile) {
          setFormData((prev) => ({
            ...prev,
            ...data.profile,
            contact: { ...prev.contact, ...(data.profile.contact || {}) },
            socialLinks: { ...prev.socialLinks, ...(data.profile.socialLinks || {}) }
          }));
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await profileApi.updateMe(formData);
      showToast('Brand profile successfully saved!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to save profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const addColor = () => {
    if (colorInput && !formData.brandColors.includes(colorInput)) {
      setFormData({
        ...formData,
        brandColors: [...formData.brandColors, colorInput]
      });
    }
  };

  const removeColor = (color) => {
    setFormData({
      ...formData,
      brandColors: formData.brandColors.filter((c) => c !== color)
    });
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-slate-400">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
        <span className="text-xs">Loading profile settings...</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-8 pb-16">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
          <Building2 className="w-3.5 h-3.5" />
          Optional Brand & Organization Profile
        </div>
        <h1 className="text-3xl font-bold text-white">Brand & Organization Profile</h1>
        <p className="text-xs text-slate-400 mt-1">
          Save recurring details for your college club, business, or creator channel. When creating posters and copy, you can optionally inject these brand guidelines.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-3xl glass-panel p-6 sm:p-8 border border-slate-800 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Profile Classification</label>
            <select
              value={formData.profileType}
              onChange={(e) => setFormData({ ...formData, profileType: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 outline-none focus:border-indigo-500"
            >
              {PROFILE_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Brand / Club / Entity Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. ACM Student Chapter or TechPulse Inc"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-200 placeholder:text-slate-600 focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Mission / Brand Tagline</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g. Fostering software innovation, hackathons, and open source mentorship for students."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-600 focus:border-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Logo Image URL</label>
            <input
              type="url"
              value={formData.logoUrl}
              onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
              placeholder="https://example.com/logo.png"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-600 focus:border-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Official Website</label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://acm-chapter.edu"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-600 focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Brand Colors */}
        <div className="pt-4 border-t border-slate-800/80 space-y-3">
          <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-purple-400" />
            Brand Color Palette
          </label>
          <div className="flex items-center gap-3 flex-wrap">
            {formData.brandColors.map((color) => (
              <div
                key={color}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
              >
                <div
                  className="w-4 h-4 rounded-full border border-white/20"
                  style={{ backgroundColor: color }}
                />
                <span className="font-mono">{color}</span>
                <button
                  type="button"
                  onClick={() => removeColor(color)}
                  className="text-slate-400 hover:text-rose-400 ml-1"
                >
                  ✕
                </button>
              </div>
            ))}

            <div className="flex items-center gap-2">
              <input
                type="color"
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
              />
              <button
                type="button"
                onClick={addColor}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-indigo-400 font-medium"
              >
                + Add Color
              </button>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="pt-4 border-t border-slate-800/80 space-y-3">
          <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Share2 className="w-4 h-4 text-cyan-400" />
            Social Presence Handles
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              value={formData.socialLinks.linkedin}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, linkedin: e.target.value }
                })
              }
              placeholder="LinkedIn: linkedin.com/company/acm"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-600 outline-none focus:border-indigo-500"
            />
            <input
              type="text"
              value={formData.socialLinks.instagram}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, instagram: e.target.value }
                })
              }
              placeholder="Instagram: @acm_club"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-600 outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Profile Context'}
          </button>
        </div>
      </form>
    </div>
  );
}
