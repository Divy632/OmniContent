import React, { useRef, useEffect, useState } from 'react';
import { Download, RefreshCw, Palette, Sparkles, Image as ImageIcon } from 'lucide-react';
import confetti from 'canvas-confetti';

const THEMES = [
  { id: 'cyber', name: 'Cyber Neon', bgGradient: ['#0f172a', '#1e1b4b'], accent: '#38bdf8', secondary: '#818cf8', text: '#f8fafc' },
  { id: 'sunset', name: 'Sunset Glow', bgGradient: ['#431407', '#7c2d12'], accent: '#f97316', secondary: '#facc15', text: '#fff7ed' },
  { id: 'emerald', name: 'Emerald Tech', bgGradient: ['#064e3b', '#022c22'], accent: '#34d399', secondary: '#a7f3d0', text: '#ecfdf5' },
  { id: 'royal', name: 'Royal Purple', bgGradient: ['#3b0764', '#1e1b4b'], accent: '#c084fc', secondary: '#f472b6', text: '#faf5ff' },
  { id: 'minimal', name: 'Dark Studio', bgGradient: ['#18181b', '#09090b'], accent: '#ffffff', secondary: '#a1a1aa', text: '#ffffff' },
];

export default function PosterCanvas({
  title = 'Featured Event',
  headline = '',
  details = {},
  imageUrl = '',
  aspectRatio = '3:4',
  category = 'events'
}) {
  const canvasRef = useRef(null);
  const [activeTheme, setActiveTheme] = useState(THEMES[0]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Determine canvas width and height
  let width = 800;
  let height = 1060; // 3:4 default
  if (aspectRatio === '1:1') {
    width = 900;
    height = 900;
  } else if (aspectRatio === '16:9') {
    width = 1280;
    height = 720;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // 1. Fill background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, activeTheme.bgGradient[0]);
    gradient.addColorStop(1, activeTheme.bgGradient[1]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // 2. Draw subtle background geometric accents
    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    for (let i = 0; i < width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let j = 0; j < height; j += 50) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(width, j);
      ctx.stroke();
    }
    ctx.restore();

    // 3. Draw image if present or load background
    if (imageUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageUrl;
      img.onload = () => {
        setImageLoaded(true);
        // Draw image in upper/middle frame
        const imgH = aspectRatio === '16:9' ? height : height * 0.52;
        const imgW = width;
        ctx.save();
        ctx.globalAlpha = 0.85;
        ctx.drawImage(img, 0, 0, imgW, imgH);

        // Overlay fade gradient from image to dark background
        const fadeGrad = ctx.createLinearGradient(0, imgH - 120, 0, imgH);
        fadeGrad.addColorStop(0, 'rgba(15, 23, 42, 0)');
        fadeGrad.addColorStop(1, activeTheme.bgGradient[0]);
        ctx.fillStyle = fadeGrad;
        ctx.fillRect(0, imgH - 120, imgW, 120);
        ctx.restore();

        renderTypography(ctx);
      };
      img.onerror = () => {
        // Fallback drawing if image fails CORS
        renderDecorations(ctx);
        renderTypography(ctx);
      };
    } else {
      renderDecorations(ctx);
      renderTypography(ctx);
    }

    function renderDecorations(c) {
      c.save();
      c.beginPath();
      c.arc(width * 0.8, height * 0.2, 220, 0, Math.PI * 2);
      c.fillStyle = activeTheme.accent;
      c.globalAlpha = 0.12;
      c.fill();

      c.beginPath();
      c.arc(width * 0.2, height * 0.7, 180, 0, Math.PI * 2);
      c.fillStyle = activeTheme.secondary;
      c.globalAlpha = 0.08;
      c.fill();
      c.restore();
    }

    function renderTypography(c) {
      c.save();

      // Category Tag Pill
      const tag = (category || 'AI CREATIVE').toUpperCase();
      c.fillStyle = activeTheme.accent;
      c.font = 'bold 16px Inter, sans-serif';
      c.fillText(`●  ${tag}`, 50, 60);

      // Main Title
      c.fillStyle = activeTheme.text;
      c.font = 'bold 42px Inter, sans-serif';
      wrapText(c, title || headline, 50, height * 0.56, width - 100, 50);

      // Headline / Subtitle
      if (headline && headline !== title) {
        c.fillStyle = activeTheme.secondary;
        c.font = '500 24px Inter, sans-serif';
        wrapText(c, headline, 50, height * 0.70, width - 100, 32);
      }

      // Details Box (Date, Venue, or Highlights)
      const dateText = details.date || details.dateAndTime || details.schedule || '';
      const venueText = details.venue || details.venueAddress || details.audience || '';
      const highlight = details.highlights || details.offerDiscount || details.keyTakeaways || '';

      let currentY = height * 0.80;

      if (dateText || venueText) {
        c.fillStyle = 'rgba(255, 255, 255, 0.08)';
        c.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        c.lineWidth = 1;
        roundRect(c, 50, currentY - 25, width - 100, 85, 12);
        c.fill();
        c.stroke();

        c.fillStyle = activeTheme.text;
        c.font = '600 20px Inter, sans-serif';
        if (dateText) {
          c.fillText(`📅  ${dateText}`, 70, currentY + 10);
        }
        if (venueText) {
          c.fillStyle = activeTheme.secondary;
          c.font = '500 18px Inter, sans-serif';
          c.fillText(`📍  ${venueText}`, 70, currentY + 42);
        }
        currentY += 95;
      }

      // Footer branding
      c.fillStyle = 'rgba(255, 255, 255, 0.4)';
      c.font = '14px Inter, sans-serif';
      c.fillText(`Generated with Universal AI Platform • 2026`, 50, height - 35);

      c.restore();
    }

    function wrapText(c, text, x, y, maxWidth, lineHeight) {
      if (!text) return;
      const words = text.split(' ');
      let line = '';
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = c.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          c.fillText(line, x, y);
          line = words[n] + ' ';
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      c.fillText(line, x, y);
    }

    function roundRect(c, x, y, w, h, r) {
      c.beginPath();
      c.moveTo(x + r, y);
      c.arcTo(x + w, y, x + w, y + h, r);
      c.arcTo(x + w, y + h, x, y + h, r);
      c.arcTo(x, y + h, x, y, r);
      c.arcTo(x, y, x + w, y, r);
      c.closePath();
    }
  }, [title, headline, details, imageUrl, activeTheme, aspectRatio, category, width, height]);

  const handleDownload = () => {
    setDownloading(true);
    try {
      const canvas = canvasRef.current;
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_poster.png`;
      link.href = dataUrl;
      link.click();

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Theme selector pills */}
      <div className="flex items-center gap-2 flex-wrap justify-center p-2 rounded-xl bg-slate-900/80 border border-slate-800">
        <span className="text-xs text-slate-400 flex items-center gap-1 pl-1">
          <Palette className="w-3.5 h-3.5 text-indigo-400" />
          Style:
        </span>
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => setActiveTheme(theme)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              activeTheme.id === theme.id
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {theme.name}
          </button>
        ))}
      </div>

      {/* Responsive Canvas Display */}
      <div className="relative group max-w-full overflow-hidden rounded-2xl shadow-2xl border border-slate-800/80 bg-slate-950">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="w-full max-h-[580px] object-contain block rounded-2xl"
        />

        {/* Hover quick download overlay */}
        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-slate-900/90 text-slate-100 text-xs px-3 py-1.5 rounded-full border border-slate-700 shadow-lg flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Live Rendered Canvas
          </span>
        </div>
      </div>

      {/* Download Action */}
      <div className="flex items-center gap-3 w-full">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium text-sm shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.99]"
        >
          <Download className="w-4 h-4" />
          {downloading ? 'Preparing PNG...' : 'Download High-Res Graphic (PNG)'}
        </button>

        {imageUrl && (
          <a
            href={imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-sm border border-slate-700 transition-all"
            title="Open Raw AI Artwork"
          >
            <ImageIcon className="w-4 h-4" />
            Raw AI Artwork
          </a>
        )}
      </div>
    </div>
  );
}
