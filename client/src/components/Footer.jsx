import React from 'react';
import { Sparkles, Heart, Code2, Database, Cpu, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950/90 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-slate-200 text-sm">
              AI-Powered Universal Content Creation Platform
            </span>
          </div>
          <p className="text-xs text-slate-500 max-w-md text-center md:text-left">
            A full-stack MERN application engineering structured AI workflows for students, professionals, creators, and businesses.
          </p>
        </div>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
            <Code2 className="w-3 h-3 text-cyan-400" /> React 19
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
            <Cpu className="w-3 h-3 text-emerald-400" /> Node.js & Express
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
            <Database className="w-3 h-3 text-amber-400" /> MongoDB
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
            <Globe className="w-3 h-3 text-purple-400" /> Multi-modal AI
          </span>
        </div>

        <div className="text-xs text-slate-500 text-center md:text-right">
          Final-Year Engineering Project • 2026
        </div>
      </div>
    </footer>
  );
}
