import React, { useState } from 'react';
import { SectionContent } from '../data/blogPostData';
import { Quote, Share2, Check } from 'lucide-react';

interface ArticleReaderProps {
  sections: SectionContent[];
  activeSectionId: string;
  highlightedParagraph?: { sectionId: string; paragraphIndex: number } | null;
}

export const ArticleReader: React.FC<ArticleReaderProps> = ({
  sections,
  activeSectionId,
  highlightedParagraph
}) => {
  const [copiedSectionId, setCopiedSectionId] = useState<string | null>(null);

  const handleCopySection = (section: SectionContent) => {
    const text = `${section.title}\n\n${section.paragraphs.join('\n\n')}`;
    navigator.clipboard.writeText(text);
    setCopiedSectionId(section.id);
    setTimeout(() => setCopiedSectionId(null), 2000);
  };

  return (
    <article className="space-y-16">
      {sections.map((section, sIdx) => {
        const isIntro = section.id === 'introduction';
        const isConclusion = section.id === 'conclusion';

        return (
          <section
            key={section.id}
            id={section.id}
            className="scroll-mt-24 pb-4 transition-all"
          >
            {/* Section Header */}
            <div className="mb-6 flex items-baseline justify-between gap-4 border-b border-stone-200 pb-2">
              <div>
                <h2 className="font-editorial-heading text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight leading-snug">
                  {section.title}
                </h2>
                {section.subtitle && (
                  <p className="font-editorial-body text-base text-stone-600 italic mt-1">
                    {section.subtitle}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleCopySection(section)}
                className="text-stone-400 hover:text-stone-700 p-1.5 rounded transition-colors shrink-0 cursor-pointer"
                title="Copy section text"
              >
                {copiedSectionId === section.id ? (
                  <Check className="w-4 h-4 text-emerald-700" />
                ) : (
                  <Share2 className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Paragraphs */}
            <div className="space-y-6 text-stone-800 font-editorial-body text-base sm:text-lg leading-[1.8] sm:leading-[1.85]">
              {section.paragraphs.map((paragraph, pIdx) => {
                const isFirstParagraph = isIntro && pIdx === 0;
                const isHighlighted =
                  highlightedParagraph?.sectionId === section.id &&
                  highlightedParagraph?.paragraphIndex === pIdx;

                return (
                  <p
                    key={pIdx}
                    className={`transition-colors duration-300 ${
                      isHighlighted
                        ? 'bg-amber-100/70 p-3 rounded -mx-3'
                        : ''
                    } ${
                      isFirstParagraph
                        ? 'first-letter:text-5xl sm:first-letter:text-6xl first-letter:font-editorial-heading first-letter:font-bold first-letter:float-left first-letter:mr-3.5 first-letter:mt-1 first-letter:text-stone-950 first-letter:leading-none'
                        : ''
                    }`}
                  >
                    {renderWithCitationLinks(paragraph)}
                  </p>
                );
              })}
            </div>

            {/* Pull Quote */}
            {section.pullQuote && (
              <figure className="my-10 py-6 px-8 bg-stone-100/60 rounded border-y border-stone-200/90 text-center">
                <Quote className="w-6 h-6 text-stone-400 mx-auto mb-3" />
                <blockquote className="font-editorial-heading text-xl sm:text-2xl italic font-medium text-stone-800 leading-snug max-w-2xl mx-auto [text-wrap:balance]">
                  “{section.pullQuote.text}”
                </blockquote>
                <figcaption className="font-sans text-xs uppercase tracking-wider text-stone-500 font-semibold mt-3">
                  — {section.pullQuote.attribution}
                </figcaption>
              </figure>
            )}

            {/* Optional Figure / Image */}
            {section.figure && (
              <figure className="my-10">
                <div className="aspect-4/3 sm:aspect-16/10 w-full overflow-hidden rounded bg-stone-100 border border-stone-200">
                  <img
                    src={section.figure.imageSrc}
                    alt={section.figure.alt}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <figcaption className="font-editorial-body text-xs text-stone-500 italic mt-2.5">
                  {section.figure.caption}
                </figcaption>
              </figure>
            )}
          </section>
        );
      })}
    </article>
  );
};

/**
 * Highlights scholarly in-text citations like [1], [2], [3], [4] or (UNESCO, 2023)
 * with smooth scroll jump affordance.
 */
function renderWithCitationLinks(text: string): React.ReactNode {
  // Replace citation patterns with clickable anchors to citations section
  const citationRegex = /(\[(?:1|2|3|4)\]|\(UNESCO, 2023\)|\(OECD, 2023\)|\(WEF, 2024\)|Reich & Mehta \(2022\))/g;
  const parts = text.split(citationRegex);

  if (parts.length === 1) return text;

  return parts.map((part, index) => {
    if (part === '[1]' || part === '(UNESCO, 2023)') {
      return (
        <a
          key={index}
          href="#cit-1"
          className="text-stone-700 hover:text-stone-950 font-semibold underline decoration-stone-300 underline-offset-2 transition-colors cursor-pointer"
          title="Jump to UNESCO citation"
        >
          {part}
        </a>
      );
    }
    if (part === '[2]' || part === '(OECD, 2023)') {
      return (
        <a
          key={index}
          href="#cit-2"
          className="text-stone-700 hover:text-stone-950 font-semibold underline decoration-stone-300 underline-offset-2 transition-colors cursor-pointer"
          title="Jump to OECD citation"
        >
          {part}
        </a>
      );
    }
    if (part === '[3]' || part === '(WEF, 2024)') {
      return (
        <a
          key={index}
          href="#cit-3"
          className="text-stone-700 hover:text-stone-950 font-semibold underline decoration-stone-300 underline-offset-2 transition-colors cursor-pointer"
          title="Jump to WEF citation"
        >
          {part}
        </a>
      );
    }
    if (part === '[4]' || part.includes('Reich & Mehta')) {
      return (
        <a
          key={index}
          href="#cit-4"
          className="text-stone-700 hover:text-stone-950 font-semibold underline decoration-stone-300 underline-offset-2 transition-colors cursor-pointer"
          title="Jump to Reich & Mehta citation"
        >
          {part}
        </a>
      );
    }
    return part;
  });
}
