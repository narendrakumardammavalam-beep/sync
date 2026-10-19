import React from 'react';
import { Download, FileText, CheckCircle2, Sliders } from 'lucide-react';

interface TopBarProps {
  wordCount: number;
  onOpenExport: () => void;
  onOpenRevision: () => void;
  onQuickDownload: (format: 'docx' | 'doc') => void;
  activeTab: 'read' | 'revise' | 'evidence' | 'citations';
  setActiveTab: (tab: 'read' | 'revise' | 'evidence' | 'citations') => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  wordCount,
  onOpenExport,
  onOpenRevision,
  onQuickDownload,
  activeTab,
  setActiveTab
}) => {
  const meetsWordTarget = wordCount >= 1500 && wordCount <= 2000;

  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element in editorial face) */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('read');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="font-editorial-heading text-xl lg:text-2xl font-bold tracking-tight text-stone-900 whitespace-nowrap hover:text-stone-700 transition-colors"
          >
            The Educational Review
          </a>
          <span className="hidden xl:inline text-xs font-sans text-stone-500 whitespace-nowrap border-l border-stone-300 pl-3">
            Scholarly Monograph Series
          </span>
        </div>

        {/* Zone 2: Navigation Links (Single-line, unboxed, subtle hover) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
          <button
            type="button"
            onClick={() => {
              setActiveTab('read');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTab === 'read' ? 'text-stone-950 font-semibold' : 'hover:text-stone-900'
            }`}
          >
            Blog Post
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('read');
              document.getElementById('evidence-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="whitespace-nowrap shrink-0 hover:text-stone-900 transition-colors cursor-pointer"
          >
            Comparative Evidence
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('read');
              document.getElementById('sources-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="whitespace-nowrap shrink-0 hover:text-stone-900 transition-colors cursor-pointer"
          >
            Peer Sources
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('revise');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTab === 'revise' ? 'text-stone-950 font-semibold' : 'hover:text-stone-900'
            }`}
          >
            Revision & Editor
          </button>
        </nav>

        {/* Zone 3: Primary Action & Quick Export Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Subtle Word Count Badge */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-stone-600 bg-stone-100/80 px-2.5 py-1 rounded border border-stone-200/60 font-mono-numbers">
            <span className="font-semibold text-stone-900">{wordCount}</span>
            <span>words</span>
            {meetsWordTarget && <CheckCircle2 className="w-3.5 h-3.5 text-stone-700" />}
          </div>

          <button
            type="button"
            onClick={onOpenRevision}
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 border border-stone-200 rounded hover:bg-stone-200/80 transition-colors whitespace-nowrap cursor-pointer"
            title="Edit and revise content"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Customize Text</span>
          </button>

          {/* Primary Action Button */}
          <div className="relative inline-flex shadow-sm rounded">
            <button
              type="button"
              onClick={() => onQuickDownload('docx')}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-stone-900 rounded hover:bg-stone-800 transition-colors whitespace-nowrap cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download DOC (.docx)</span>
            </button>
            <button
              type="button"
              onClick={onOpenExport}
              className="px-2.5 py-2 text-xs font-semibold text-stone-300 bg-stone-900 hover:bg-stone-800 border-l border-stone-700 rounded-r transition-colors cursor-pointer"
              title="More export options"
            >
              <FileText className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
