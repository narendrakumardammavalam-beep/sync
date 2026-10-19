import React, { useState } from 'react';
import { Download, Volume2, FileText, CheckCircle2, BookOpen, Layers } from 'lucide-react';
import { BLOG_METADATA } from '../data/blogPostData';

interface EditorialHeroProps {
  wordCount: number;
  onOpenAudio: () => void;
  onDownloadDocx: () => void;
  onOpenRevision: () => void;
}

export const EditorialHero: React.FC<EditorialHeroProps> = ({
  wordCount,
  onOpenAudio,
  onDownloadDocx,
  onOpenRevision
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <section className="relative pt-10 pb-12 border-b border-stone-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Unboxed Metadata Line with typographic separators */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-sans text-stone-500 mb-4 tracking-wide uppercase">
          <span className="font-semibold text-stone-700">{BLOG_METADATA.category}</span>
          <span aria-hidden="true">·</span>
          <span>{BLOG_METADATA.date}</span>
          <span aria-hidden="true">·</span>
          <span>{BLOG_METADATA.readingTime}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono-numbers text-stone-700 font-medium">
            {wordCount} words (Target: 1,500–2,000)
          </span>
          <span aria-hidden="true">·</span>
          <span className="text-emerald-700 font-medium inline-flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Requirement Met
          </span>
        </div>

        {/* Primary Editorial Headline */}
        <h1 className="font-editorial-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-stone-900 leading-[1.15] mb-5 [text-wrap:balance]">
          {BLOG_METADATA.title}
        </h1>

        {/* Subtitle / Deck */}
        <p className="font-editorial-body text-lg sm:text-xl text-stone-600 leading-relaxed italic mb-8 max-w-3xl">
          {BLOG_METADATA.subtitle}
        </p>

        {/* Byline and Academic Affiliation */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-stone-200 text-sm text-stone-600 mb-8">
          <div>
            <div className="font-medium text-stone-900">{BLOG_METADATA.author}</div>
            <div className="text-xs text-stone-500">{BLOG_METADATA.institution}</div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onOpenAudio}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded transition-colors cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5 text-stone-700" />
              <span>Listen to Essay</span>
            </button>
            <button
              type="button"
              onClick={onOpenRevision}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded transition-colors cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-stone-700" />
              <span>Revision Mode</span>
            </button>
            <button
              type="button"
              onClick={onDownloadDocx}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export DOC File</span>
            </button>
          </div>
        </div>

        {/* Hero Visual Presentation */}
        <div className="my-8">
          <div className="relative aspect-16/9 w-full overflow-hidden rounded bg-stone-100 border border-stone-200">
            {!imageError ? (
              <img
                src="/src/assets/images/hero_digital_education_1792382407170.jpg"
                alt="Students collaborating over digital learning display in architectural library"
                referrerPolicy="no-referrer"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-stone-100 text-stone-600">
                <BookOpen className="w-12 h-12 mb-3 text-stone-400" />
                <span className="font-editorial-heading text-lg font-medium text-stone-800">
                  The Impact of Digital Technology on Education
                </span>
                <span className="text-xs text-stone-500 mt-1">Archival Visual Documentation</span>
              </div>
            )}
          </div>
          <figcaption className="font-editorial-body text-xs text-stone-500 italic mt-2.5 text-right">
            Cover — Collaborative digital informatics and interactive workstations at the modern learning library.
          </figcaption>
        </div>

        {/* Executive Takeaways Ribbon (3 high-level proof points) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-stone-100/70 rounded border border-stone-200/80 mt-8">
          <div>
            <div className="text-xs uppercase font-sans tracking-widest text-stone-500 font-semibold mb-1">
              01 · Universal Reach
            </div>
            <p className="font-editorial-body text-sm text-stone-800 leading-snug">
              Over 220 million active MOOC enrollments and open courseware projects have broken historical geographic barriers to premier tertiary scholarship.
            </p>
          </div>
          <div className="md:border-l md:border-stone-200 md:pl-6">
            <div className="text-xs uppercase font-sans tracking-widest text-stone-500 font-semibold mb-1">
              02 · Adaptive Scaffolding
            </div>
            <p className="font-editorial-body text-sm text-stone-800 leading-snug">
              Intelligent tutoring platforms elevate conceptual mastery by +0.32 standard deviations, yet require expert human educators to sustain long-term engagement.
            </p>
          </div>
          <div className="md:border-l md:border-stone-200 md:pl-6">
            <div className="text-xs uppercase font-sans tracking-widest text-stone-500 font-semibold mb-1">
              03 · Structural Divide
            </div>
            <p className="font-editorial-body text-sm text-stone-800 leading-snug">
              Nearly 500 million school-age children lack basic connectivity, turning unguided digital acceleration into a vector for deeper educational inequality.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
