import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { catalogApi } from '../services/api';
import {
  Sparkles,
  ArrowRight,
  Filter,
  Image as ImageIcon,
  FileText,
  Search,
  CheckCircle2
} from 'lucide-react';

export default function CreateCatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';

  const [categories, setCategories] = useState([]);
  const [contentTypes, setContentTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCatalog() {
      try {
        const [catData, typesData] = await Promise.all([
          catalogApi.getCategories(),
          catalogApi.getContentTypes()
        ]);
        if (catData.categories) setCategories(catData.categories);
        if (typesData.contentTypes) setContentTypes(typesData.contentTypes);
      } catch (err) {
        console.error('Failed to load catalog:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCatalog();
  }, []);

  const handleSelectCategory = (catId) => {
    if (catId === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: catId });
    }
  };

  const filtered = contentTypes.filter((t) => {
    const matchesCategory = activeCategory === 'all' || t.categoryId === activeCategory;
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.categoryName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Content Catalog & Dynamic Workflows
          </div>
          <h1 className="text-3xl font-bold text-white">Select Content Type</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Choose a structured blueprint below. Each template renders tailored input fields, prompt instructions, and multi-modal generators.
          </p>
        </div>

        {/* Search */}
        <div className="relative md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search templates..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => handleSelectCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeCategory === 'all'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          All Categories ({contentTypes.length})
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => handleSelectCategory(c.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === c.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {c.title}
          </button>
        ))}
      </div>

      {/* Grid of Content Types */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
          <span className="text-xs">Loading content blueprints...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center rounded-2xl glass-card border border-slate-800">
          <p className="text-slate-400 text-sm">No content types match your query.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              handleSelectCategory('all');
            }}
            className="mt-3 text-xs text-indigo-400 font-semibold"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-semibold text-indigo-400 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                    {item.categoryName}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    {item.supportedOutputs.includes('text') && (
                      <span className="flex items-center gap-0.5 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        <FileText className="w-3 h-3 text-cyan-400" /> Text
                      </span>
                    )}
                    {item.supportedOutputs.includes('image') && (
                      <span className="flex items-center gap-0.5 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        <ImageIcon className="w-3 h-3 text-pink-400" /> Image
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {item.description}
                </p>

                {/* Field count and details */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-3 text-[11px] text-slate-500">
                  <span>{item.fields?.length || 0} Dynamic Inputs</span>
                  <span>•</span>
                  <span>Ratio: {item.aspectRatio || 'Standard'}</span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to={`/create/${item.id}`}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 group-hover:bg-indigo-600 text-slate-200 group-hover:text-white border border-slate-800 group-hover:border-indigo-500 text-xs font-semibold transition-all shadow-sm group-hover:shadow-indigo-600/20"
                >
                  Configure & Generate
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
