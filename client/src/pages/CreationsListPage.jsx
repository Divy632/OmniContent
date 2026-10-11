import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { creationApi } from '../services/api';
import { useToast } from '../components/Toast';
import {
  FolderHeart,
  PlusCircle,
  Search,
  Filter,
  Grid,
  List,
  Trash2,
  ExternalLink,
  Calendar,
  Clock,
  Sparkles,
  Copy,
  Tag
} from 'lucide-react';

export default function CreationsListPage() {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const { showToast } = useToast();

  const loadCreations = async () => {
    try {
      const data = await creationApi.list();
      if (data.creations) {
        setCreations(data.creations);
      }
    } catch (err) {
      showToast(err.message || 'Failed to fetch creations', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCreations();
  }, []);

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this creation?')) return;

    try {
      await creationApi.delete(id);
      setCreations((prev) => prev.filter((c) => c._id !== id));
      showToast('Creation removed.', 'info');
    } catch (err) {
      showToast(err.message || 'Failed to delete creation', 'error');
    }
  };

  const handleCopyHeadline = (headline, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!headline) return;
    navigator.clipboard.writeText(headline);
    showToast('Headline copied to clipboard!', 'success');
  };

  const filtered = creations.filter((c) => {
    const matchesCat = categoryFilter === 'all' || c.contentCategory === categoryFilter;
    const s = search.toLowerCase();
    const matchesSearch =
      c.title?.toLowerCase().includes(s) ||
      c.generatedText?.headline?.toLowerCase().includes(s) ||
      c.contentType?.toLowerCase().includes(s);
    return matchesCat && matchesSearch;
  });

  const categories = Array.from(new Set(creations.map((c) => c.contentCategory).filter(Boolean)));

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <FolderHeart className="w-3.5 h-3.5" />
            My Creations Library
          </div>
          <h1 className="text-3xl font-bold text-white">Saved Generations</h1>
          <p className="text-xs text-slate-400 mt-1">
            Organize, retrieve, refine, and download your previous creative outputs ({creations.length} total)
          </p>
        </div>

        <Link
          to="/create"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/25 transition-all self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Create New Content
        </Link>
      </div>

      {/* Filter and View Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              categoryFilter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            All Categories ({creations.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-all ${
                categoryFilter === cat
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat} ({creations.filter((c) => c.contentCategory === cat).length})
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Search box */}
          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-indigo-500"
            />
          </div>

          {/* View toggle */}
          <div className="flex items-center p-0.5 rounded-xl bg-slate-950 border border-slate-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content Display */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center text-slate-400">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
          <span className="text-xs">Loading creations from MongoDB...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl glass-panel p-12 border border-slate-800 text-center flex flex-col items-center">
          <FolderHeart className="w-12 h-12 text-slate-600 mb-4" />
          <h3 className="text-lg font-bold text-white">No creations found</h3>
          <p className="text-xs text-slate-400 max-w-sm mt-1 mb-6">
            {search
              ? 'Try adjusting your search keywords or clearing the category filter.'
              : 'You have not generated any content yet. Start now with any of our 8 content categories.'}
          </p>
          <Link
            to="/create"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20"
          >
            <PlusCircle className="w-4 h-4" />
            Create Your First Content
          </Link>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((item) => (
            <Link
              key={item._id}
              to={`/creations/${item._id}`}
              className="glass-card rounded-2xl border border-slate-800 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/5 transition-all overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Visual Thumbnail */}
                {item.imageUrl ? (
                  <div className="h-44 w-full bg-slate-900 relative overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 flex items-center gap-1">
                      <button
                        onClick={(e) => handleDelete(item._id, e)}
                        className="p-1.5 rounded-lg bg-slate-950/80 hover:bg-rose-900/80 text-slate-300 hover:text-rose-200 backdrop-blur-sm transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="absolute bottom-2 left-2 text-[10px] font-semibold bg-slate-950/80 px-2 py-0.5 rounded text-indigo-300 backdrop-blur-sm">
                      {item.contentType.replace('_', ' ')}
                    </span>
                  </div>
                ) : (
                  <div className="h-28 w-full bg-gradient-to-br from-slate-900 to-indigo-950/40 p-4 flex flex-col justify-between border-b border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider">
                        {item.contentCategory}
                      </span>
                      <button
                        onClick={(e) => handleDelete(item._id, e)}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-xs text-slate-300 font-mono">Text Blueprint</span>
                  </div>
                )}

                {/* Card Body */}
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-white text-sm line-clamp-1 group-hover:text-indigo-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {item.generatedText?.headline || item.generatedText?.caption || 'Custom AI Generated Content'}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 pt-0 mt-3 flex items-center justify-between border-t border-slate-800/60 text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
                <span className="text-indigo-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  View & Edit
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="rounded-2xl glass-panel border border-slate-800 divide-y divide-slate-800/80">
          {filtered.map((item) => (
            <div
              key={item._id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-900/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-800"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-slate-900 flex items-center justify-center shrink-0 border border-slate-800 text-indigo-400 font-mono text-xs">
                    TXT
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider">
                      {item.contentType.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      • {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-sm mt-0.5">{item.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                    {item.generatedText?.headline || item.generatedText?.caption}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={(e) => handleCopyHeadline(item.generatedText?.headline, e)}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                  title="Copy Headline"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <Link
                  to={`/creations/${item._id}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all"
                >
                  Open Editor
                  <ExternalLink className="w-3 h-3" />
                </Link>
                <button
                  onClick={(e) => handleDelete(item._id, e)}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
