import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { catalogApi, creationApi } from '../services/api';
import {
  Sparkles,
  PlusCircle,
  FolderHeart,
  Search,
  Calendar,
  Briefcase,
  MailOpen,
  TrendingUp,
  Video,
  Share2,
  GraduationCap,
  Heart,
  ArrowRight,
  Clock,
  Layers,
  Sliders
} from 'lucide-react';

const iconMap = {
  Calendar,
  Briefcase,
  MailOpen,
  TrendingUp,
  Video,
  Share2,
  GraduationCap,
  Heart
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [recentCreations, setRecentCreations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [contentTypes, setContentTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [catData, creationsData, typesData] = await Promise.all([
          catalogApi.getCategories(),
          creationApi.list(),
          catalogApi.getContentTypes()
        ]);

        if (catData.categories) setCategories(catData.categories);
        if (creationsData.creations) setRecentCreations(creationsData.creations.slice(0, 4));
        if (typesData.contentTypes) setContentTypes(typesData.contentTypes);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const filteredTypes = contentTypes.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-10">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl glass-panel p-8 sm:p-10 border border-slate-800 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Universal Content Workspace
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.name || 'Creator'}!
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              Choose what you want to create today. Your structured AI forms convert details into posters, social posts, and career milestones.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/create"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 transition-all active:scale-[0.99]"
            >
              <PlusCircle className="w-4 h-4" />
              Create Content
            </Link>
            <Link
              to="/creations"
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-medium text-sm border border-slate-800 transition-all"
            >
              <FolderHeart className="w-4 h-4 text-indigo-400" />
              My Creations ({recentCreations.length})
            </Link>
          </div>
        </div>

        {/* Quick User Stats / Context */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80 text-xs">
          <div>
            <span className="text-slate-500 block">Total Creations</span>
            <span className="text-base font-bold text-white mt-0.5 block">{recentCreations.length} items</span>
          </div>
          <div>
            <span className="text-slate-500 block">Default Language</span>
            <span className="text-base font-bold text-indigo-400 mt-0.5 block">{user?.preferences?.language || 'English'}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Writing Tone</span>
            <span className="text-base font-bold text-emerald-400 mt-0.5 block">{user?.preferences?.tone || 'Professional'}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Visual Preference</span>
            <span className="text-base font-bold text-purple-400 mt-0.5 block">{user?.preferences?.visualStyle || 'Modern Minimalist'}</span>
          </div>
        </div>
      </div>

      {/* Search and Browse Content Types */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">What would you like to create?</h2>
            <p className="text-xs text-slate-400">Search 12+ pre-configured structured templates or select a category</p>
          </div>

          <div className="relative sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates (e.g. hackathon, poster, linkedin)..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {searchQuery ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTypes.map((t) => (
              <Link
                key={t.id}
                to={`/create/${t.id}`}
                className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/90 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/10">
                      {t.categoryName}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {t.supportedOutputs.join(' + ')}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-base group-hover:text-indigo-300 transition-colors">
                    {t.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{t.description}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-indigo-400 font-medium">
                  <span>Open Form</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Category Cards Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => {
              const Icon = iconMap[cat.icon] || Sparkles;
              return (
                <Link
                  key={cat.id}
                  to={`/create?category=${cat.id}`}
                  className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/90 transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                        {cat.badge}
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-base group-hover:text-indigo-300 transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{cat.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-indigo-400 font-medium">
                    <span>Browse templates</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Creations Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Recent Creations</h2>
            <p className="text-xs text-slate-400">Revisit, edit, regenerate, or download your saved content</p>
          </div>
          <Link
            to="/creations"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            View all ({recentCreations.length})
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentCreations.length === 0 ? (
          <div className="rounded-2xl glass-card p-8 border border-slate-800 text-center flex flex-col items-center">
            <FolderHeart className="w-10 h-10 text-slate-600 mb-3" />
            <h3 className="text-base font-semibold text-slate-200">No creations saved yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mt-1 mb-5">
              Select any category above to generate your first event poster, LinkedIn post, or invitation!
            </p>
            <Link
              to="/create"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all"
            >
              Start Your First Creation
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentCreations.map((item) => (
              <Link
                key={item._id}
                to={`/creations/${item._id}`}
                className="glass-card rounded-2xl border border-slate-800 hover:border-indigo-500/40 overflow-hidden flex flex-col justify-between group transition-all"
              >
                {item.imageUrl ? (
                  <div className="h-36 w-full overflow-hidden bg-slate-900 relative">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute bottom-2 left-2 text-[10px] font-medium bg-slate-950/80 px-2 py-0.5 rounded text-indigo-300 backdrop-blur-sm">
                      {item.contentType.replace('_', ' ')}
                    </span>
                  </div>
                ) : (
                  <div className="h-28 w-full bg-gradient-to-br from-slate-900 to-indigo-950/40 p-4 flex flex-col justify-between">
                    <span className="text-[10px] font-medium text-indigo-400 uppercase tracking-wider">
                      {item.contentCategory}
                    </span>
                    <span className="text-xs text-slate-300 font-mono">Text Asset</span>
                  </div>
                )}

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-white text-sm line-clamp-1 group-hover:text-indigo-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {item.generatedText?.headline || item.generatedText?.caption || 'Custom AI Generated Content'}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-indigo-400 font-medium group-hover:underline">Edit & Export</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
