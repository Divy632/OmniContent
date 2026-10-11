import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  ArrowRight,
  Calendar,
  Briefcase,
  MailOpen,
  TrendingUp,
  Video,
  Share2,
  GraduationCap,
  Heart,
  CheckCircle2,
  Layers,
  Cpu,
  Database,
  Lock,
  Download,
  Edit3
} from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  const categories = [
    {
      id: 'events',
      title: 'Events & Posters',
      description: 'College hackathons, technical symposiums, sports meets, and club announcements.',
      icon: Calendar,
      color: 'from-blue-500 to-indigo-600',
      sample: 'College Hackathon 2026'
    },
    {
      id: 'professional',
      title: 'Professional & Career',
      description: 'LinkedIn thought leadership, internship completion stories, and project announcements.',
      icon: Briefcase,
      color: 'from-cyan-500 to-blue-600',
      sample: 'Full-Stack Internship Showcase'
    },
    {
      id: 'invitations',
      title: 'Invitations & Cards',
      description: 'Festive birthday invites, elegant wedding dinners, farewells, and milestone parties.',
      icon: MailOpen,
      color: 'from-pink-500 to-rose-600',
      sample: '21st Birthday Retro Bash'
    },
    {
      id: 'business',
      title: 'Business & Marketing',
      description: 'Product launch campaigns, flash sales, festive discount banners, and promo copy.',
      icon: TrendingUp,
      color: 'from-amber-500 to-orange-600',
      sample: '50% OFF Audio Gear Launch'
    },
    {
      id: 'creator_tools',
      title: 'Content Creator Hub',
      description: 'High-CTR YouTube thumbnail concepts, video descriptions, titles, and hooks.',
      icon: Video,
      color: 'from-red-500 to-pink-600',
      sample: 'How I Built SaaS in 48h'
    },
    {
      id: 'social_media',
      title: 'Social Media',
      description: 'Instagram captions, carousel scripts, Twitter threads, and viral hashtag sets.',
      icon: Share2,
      color: 'from-purple-500 to-indigo-600',
      sample: 'Digital Nomad Life Story'
    },
    {
      id: 'education',
      title: 'Academic & Workshops',
      description: 'AI masterclass flyers, study group notices, bootcamp syllabus announcements.',
      icon: GraduationCap,
      color: 'from-emerald-500 to-teal-600',
      sample: 'GenAI Python Masterclass'
    },
    {
      id: 'personal',
      title: 'Greetings & Quotes',
      description: 'Motivational quote cards, congratulatory letters, and heartfelt reflections.',
      icon: Heart,
      color: 'from-violet-500 to-purple-600',
      sample: 'Morning Coding Motivation'
    }
  ];

  const workflowSteps = [
    { num: '01', title: 'Choose Content Type', desc: 'Select from 12+ tailored categories without needing prior prompt engineering.' },
    { num: '02', title: 'Fill Structured Form', desc: 'Input specific facts: event dates, topics, discounts, themes, and tone.' },
    { num: '03', title: 'AI Synthesis Engine', desc: 'Multi-modal engine produces cohesive text copy and stunning visual artwork.' },
    { num: '04', title: 'Interactive Edit & Style', desc: 'Fine-tune headlines, switch poster themes on Canvas, and refine hashtags.' },
    { num: '05', title: 'Download & History', desc: 'Export high-res PNGs, copy copyable text, and revisit anytime in MongoDB.' }
  ];

  return (
    <div className="flex flex-col gap-24 py-6">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center text-center max-w-4xl mx-auto px-4 pt-10">
        <div className="absolute -top-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          MERN-Based Universal AI Content Creation Platform
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15] mb-6">
          Turn Structured Requirements into{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
            High-Impact Content
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl leading-relaxed mb-10">
          No complicated prompt writing required. Select what you need—college event posters, LinkedIn articles, invitations, or product marketing—and let our structured AI engine generate ready-to-use text and visuals.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 w-full">
          <Link
            to={isAuthenticated ? '/create' : '/register'}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-base shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Start Creating Free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#categories"
            className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-medium text-base border border-slate-800 transition-all"
          >
            Explore 8 Categories
          </a>
        </div>

        {/* Live Preview Card */}
        <div className="mt-16 w-full max-w-3xl rounded-2xl glass-panel p-6 shadow-2xl border border-slate-800 text-left">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs text-slate-400 ml-2 font-mono">Workflow: User Inputs → AI Multi-Modal Output</span>
            </div>
            <span className="text-xs text-indigo-400 font-semibold px-2 py-0.5 rounded bg-indigo-500/10">
              Instant Generation
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-indigo-400 font-semibold uppercase tracking-wider text-[10px]">
                Structured Input Form
              </span>
              <p className="text-slate-300">
                <span className="text-slate-500">Event:</span> National Hackathon 2026
              </p>
              <p className="text-slate-300">
                <span className="text-slate-500">Date & Venue:</span> 20 Nov 2026 • Main Campus
              </p>
              <p className="text-slate-300">
                <span className="text-slate-500">Prizes:</span> ₹1,00,000 & Internship Offers
              </p>
              <p className="text-slate-300">
                <span className="text-slate-500">Style:</span> Cyber Neon Tech
              </p>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-emerald-400 font-semibold uppercase tracking-wider text-[10px]">
                Generated Asset Output
              </span>
              <p className="text-white font-bold">🚀 NATIONAL HACKATHON 2026 IS HERE!</p>
              <p className="text-slate-400 text-[11px] line-clamp-2">
                "Join top minds at Main Campus on 20 Nov 2026! ₹1,00,000 prize pool..."
              </p>
              <div className="flex gap-1.5 flex-wrap pt-1">
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">#Hackathon</span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">#TechEvent</span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">🖼 Visual Rendered</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Steps Section */}
      <section className="max-w-6xl mx-auto px-4 w-full">
        <div className="text-center mb-12">
          <span className="text-xs text-indigo-400 font-bold uppercase tracking-widest">Architectural Flow</span>
          <h2 className="text-3xl font-bold text-white mt-2">End-to-End Content Creation Lifecycle</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto mt-2">
            Following Section 10 & 13 of the project blueprint: from client input to MongoDB persistence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {workflowSteps.map((step) => (
            <div
              key={step.num}
              className="glass-card p-5 rounded-2xl flex flex-col justify-between border border-slate-800 hover:border-indigo-500/40 transition-all group"
            >
              <div>
                <span className="text-2xl font-black text-indigo-500/40 group-hover:text-indigo-400 transition-colors">
                  {step.num}
                </span>
                <h3 className="font-semibold text-slate-100 text-base mt-2">{step.title}</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Grid (Section 6 & Appendix A) */}
      <section id="categories" className="max-w-6xl mx-auto px-4 w-full">
        <div className="text-center mb-12">
          <span className="text-xs text-indigo-400 font-bold uppercase tracking-widest">Supported Catalog</span>
          <h2 className="text-3xl font-bold text-white mt-2">8 Specialized Content Categories</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto mt-2">
            Built for students, job seekers, teachers, creators, event organizers, and businesses.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                to={`/create?category=${cat.id}`}
                className="glass-card p-6 rounded-2xl flex flex-col justify-between border border-slate-800 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all group"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white mb-4 shadow-md group-hover:scale-105 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-100 text-lg group-hover:text-indigo-300 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-indigo-400 font-medium">
                  <span>Create now</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Project Blueprint & Features */}
      <section className="max-w-6xl mx-auto px-4 w-full">
        <div className="rounded-3xl glass-panel p-8 sm:p-12 border border-slate-800 relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs text-indigo-400 font-bold uppercase tracking-widest">
                Final-Year Innovation
              </span>
              <h2 className="text-3xl font-bold text-white mt-2 mb-4">
                Why A Dedicated Workflow Beats Generic Chatbots
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Most general AI tools require typing paragraphs of prompts over and over. Our platform decouples user input from prompt engineering through content-specific templates, dynamic forms, ownership-guaranteed MongoDB storage, and live Canvas graphic downloads.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>No account type barrier: General users create freely</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Separable text and visual generation workflows</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Full editability, regeneration, and ownership isolation</span>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  to={isAuthenticated ? '/create' : '/register'}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md transition-all"
                >
                  Get Started with MERN Platform
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800">
                <Lock className="w-6 h-6 text-indigo-400 mb-2" />
                <h4 className="font-semibold text-white text-sm">Protected APIs</h4>
                <p className="text-xs text-slate-400 mt-1">
                  JWT authentication with bcrypt password hashing and user ownership validation.
                </p>
              </div>
              <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800">
                <Database className="w-6 h-6 text-emerald-400 mb-2" />
                <h4 className="font-semibold text-white text-sm">MongoDB Schemas</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Structured Mongoose models for users, creations, and optional brand profiles.
                </p>
              </div>
              <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800">
                <Edit3 className="w-6 h-6 text-amber-400 mb-2" />
                <h4 className="font-semibold text-white text-sm">Live Content Editor</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Review and edit headlines, captions, CTAs, and hashtags before saving.
                </p>
              </div>
              <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800">
                <Download className="w-6 h-6 text-pink-400 mb-2" />
                <h4 className="font-semibold text-white text-sm">Instant Downloads</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Export posters as PNG images or copy formatted captions with 1-click.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
