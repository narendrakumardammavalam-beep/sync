import React from 'react';
import { ExternalLink, BookCheck } from 'lucide-react';
import { Citation } from '../data/blogPostData';

interface CitationsSectionProps {
  citations: Citation[];
}

export const CitationsSection: React.FC<CitationsSectionProps> = ({ citations }) => {
  return (
    <section id="sources-section" className="my-16 pt-8 border-t border-stone-200">
      <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-stone-500 font-semibold mb-2">
        <BookCheck className="w-3.5 h-3.5" />
        <span>Scholarly Bibliography</span>
      </div>
      <h2 className="font-editorial-heading text-2xl lg:text-3xl font-bold text-stone-900 mb-3">
        Peer-Reviewed Sources & Institutional References
      </h2>
      <p className="font-editorial-body text-sm text-stone-600 mb-8 max-w-2xl">
        This research post synthesizes findings across global multilateral bodies, empirical trials, and educational research labs to meet rigorous academic standards.
      </p>

      <div className="space-y-6">
        {citations.map((cit) => (
          <div
            key={cit.id}
            id={`cit-${cit.number}`}
            className="p-5 rounded bg-[#F7F4EE] border border-stone-200 text-stone-900 font-sans transition-all hover:border-stone-300"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-baseline gap-2.5">
                <span className="font-mono-numbers text-sm font-bold text-stone-700 shrink-0">
                  [{cit.number}]
                </span>
                <div>
                  <h3 className="font-editorial-heading text-base font-bold text-stone-900 leading-snug">
                    {cit.title}
                  </h3>
                  <div className="text-xs text-stone-600 mt-1">
                    <span className="font-semibold text-stone-800">{cit.authors}</span> ({cit.year}).{' '}
                    <span>{cit.publication}</span>
                  </div>
                </div>
              </div>

              {cit.url && (
                <a
                  href={cit.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors shrink-0"
                >
                  <span>Access</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            <div className="mt-3.5 pt-3 border-t border-stone-200/80 text-xs font-editorial-body text-stone-700 leading-relaxed">
              <span className="font-sans font-semibold text-stone-800 uppercase tracking-wider text-[11px]">
                Core Finding & Relevance:{' '}
              </span>
              {cit.keyFindings}
            </div>

            {cit.doi && (
              <div className="mt-2 text-[11px] font-mono-numbers text-stone-500">
                DOI: {cit.doi}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
