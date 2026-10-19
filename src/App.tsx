/**
 * The Impact of Digital Technology on Education
 * Editorial Publication Suite & DOC Deliverable Generator
 */

import React, { useState, useEffect, useMemo } from 'react';
import { BLOG_SECTIONS, CITATIONS, COMPARISON_TABLE_DATA, SectionContent } from './data/blogPostData';
import { calculateTextMetrics } from './utils/textMetrics';
import { generateDocxBlob, generateClassicDocBlob, triggerDownload } from './utils/docExport';
import { TopBar } from './components/TopBar';
import { EditorialHero } from './components/EditorialHero';
import { ArticleReader } from './components/ArticleReader';
import { EvidenceTable } from './components/EvidenceTable';
import { CitationsSection } from './components/CitationsSection';
import { WordCountInspector } from './components/WordCountInspector';
import { TableOfContents } from './components/TableOfContents';
import { AudioNarrationPlayer } from './components/AudioNarrationPlayer';
import { RevisionEditorModal } from './components/RevisionEditorModal';
import { ExportModal } from './components/ExportModal';
import { ResearchWorkflowSummary } from './components/ResearchWorkflowSummary';
import { Download, FileText, CheckCircle2, RotateCcw } from 'lucide-react';

export default function App() {
  const [sections, setSections] = useState<SectionContent[]>(BLOG_SECTIONS);
  const [activeTab, setActiveTab] = useState<'read' | 'revise' | 'evidence' | 'citations'>('read');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [isAudioPlayerOpen, setIsAudioPlayerOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string>(BLOG_SECTIONS[0].id);
  const [highlightedParagraph, setHighlightedParagraph] = useState<{
    sectionId: string;
    paragraphIndex: number;
  } | null>(null);

  // Calculate live analytical text metrics
  const textMetrics = useMemo(() => {
    const allParagraphs = sections.flatMap((s) => s.paragraphs);
    return calculateTextMetrics(allParagraphs);
  }, [sections]);

  // Track active section via Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSectionId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px' }
    );

    sections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  // Quick download helper
  const handleQuickDownload = async (format: 'docx' | 'doc') => {
    const baseFilename = 'The_Impact_of_Digital_Technology_on_Education';
    if (format === 'docx') {
      const blob = await generateDocxBlob(sections, CITATIONS, COMPARISON_TABLE_DATA);
      triggerDownload(blob, `${baseFilename}.docx`);
    } else {
      const blob = generateClassicDocBlob(sections, CITATIONS, COMPARISON_TABLE_DATA);
      triggerDownload(blob, `${baseFilename}.doc`);
    }
  };

  const handleDownloadRevisionDocx = async (revisedSections: SectionContent[]) => {
    const baseFilename = 'The_Impact_of_Digital_Technology_on_Education_Revised';
    const blob = await generateDocxBlob(revisedSections, CITATIONS, COMPARISON_TABLE_DATA);
    triggerDownload(blob, `${baseFilename}.docx`);
  };

  const handleResetToDefault = () => {
    setSections(BLOG_SECTIONS);
  };

  return (
    <div id="top" className="min-h-screen bg-[#FBF9F5] text-stone-900 font-sans selection:bg-amber-200">
      {/* 3-Zone Top Navigation Contract */}
      <TopBar
        wordCount={textMetrics.wordCount}
        onOpenExport={() => setIsExportModalOpen(true)}
        onOpenRevision={() => setIsRevisionModalOpen(true)}
        onQuickDownload={handleQuickDownload}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content View Switcher */}
      {activeTab === 'read' ? (
        <main>
          {/* Editorial Hero */}
          <EditorialHero
            wordCount={textMetrics.wordCount}
            onOpenAudio={() => setIsAudioPlayerOpen(true)}
            onDownloadDocx={() => handleQuickDownload('docx')}
            onOpenRevision={() => setIsRevisionModalOpen(true)}
          />

          {/* Asymmetric Reading Layout: 70% Body / 30% Sticky Margin Rail */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Main Reading Column (8 cols ~ 67%) */}
              <div className="lg:col-span-8 max-w-prose mx-auto lg:mx-0">
                <ArticleReader
                  sections={sections}
                  activeSectionId={activeSectionId}
                  highlightedParagraph={highlightedParagraph}
                />

                {/* Empirical Synthesis Matrix */}
                <EvidenceTable data={COMPARISON_TABLE_DATA} />

                {/* Scholarly References Section */}
                <CitationsSection citations={CITATIONS} />

                {/* Methodology & Task Rubric Alignment */}
                <ResearchWorkflowSummary
                  wordCount={textMetrics.wordCount}
                  onOpenRevision={() => setIsRevisionModalOpen(true)}
                  onDownloadDocx={() => handleQuickDownload('docx')}
                />
              </div>

              {/* Sticky Editorial Margin Rail (4 cols ~ 33%) */}
              <aside className="lg:col-span-4 space-y-6">
                <div className="sticky top-24 space-y-6">
                  {/* Word Count & Objective Audit Card */}
                  <WordCountInspector
                    metrics={textMetrics}
                    onDownloadDocx={() => handleQuickDownload('docx')}
                    onOpenRevision={() => setIsRevisionModalOpen(true)}
                  />

                  {/* Table of Contents & Chapter Navigation */}
                  <TableOfContents
                    sections={sections}
                    activeSectionId={activeSectionId}
                  />

                  {/* Institutional Citation Badges */}
                  <div className="p-4 bg-[#F7F4EE] border border-stone-200 rounded text-xs space-y-2.5">
                    <div className="text-[11px] uppercase tracking-wider font-semibold text-stone-500">
                      Verified Scholarly Basis
                    </div>
                    <div className="space-y-1.5 text-stone-700 font-editorial-body">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono-numbers font-bold text-stone-900">[1]</span>
                        <span>UNESCO Global Monitoring (2023)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono-numbers font-bold text-stone-900">[2]</span>
                        <span>OECD Digital Education Outlook (2023)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono-numbers font-bold text-stone-900">[3]</span>
                        <span>World Economic Forum Report (2024)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono-numbers font-bold text-stone-900">[4]</span>
                        <span>Harvard & MIT Teaching Systems Lab (2022)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </main>
      ) : (
        /* Full Page Revision & Editorial Workspace */
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-stone-200">
            <div>
              <div className="text-xs uppercase tracking-widest font-semibold text-stone-500 mb-1">
                Post Revision & Customization Suite
              </div>
              <h1 className="font-editorial-heading text-3xl font-bold text-stone-900">
                Interactive Editorial Workspace
              </h1>
              <p className="text-sm text-stone-600 mt-1">
                Refine, edit, or customize any section in real time. Word count requirement: 1,500 – 2,000 words.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleResetToDefault}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded border border-stone-200 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Standard Draft</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('read')}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded transition-colors cursor-pointer"
              >
                <span>Back to Reader</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDownload('docx')}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download DOC (.docx)</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Header */}
          <div className="p-4 bg-stone-100/70 border border-stone-200 rounded mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-mono-numbers text-2xl font-bold text-stone-900">
                {textMetrics.wordCount}
              </span>
              <span className="text-xs text-stone-600">words in current draft</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-stone-700">
              {textMetrics.meetsWordCountRequirement ? (
                <span className="inline-flex items-center gap-1 text-emerald-800 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  Target Validated: 1500–2000 Words
                </span>
              ) : (
                <span className="text-amber-800">{textMetrics.statusMessage}</span>
              )}
            </div>
          </div>

          {/* Section Editors */}
          <div className="space-y-8">
            {sections.map((section, sIdx) => (
              <div key={section.id} className="p-6 bg-white border border-stone-200 rounded shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
                  <h2 className="font-editorial-heading text-lg font-bold text-stone-900">
                    {section.title}
                  </h2>
                  <span className="text-xs font-mono-numbers text-stone-500">
                    {section.paragraphs.reduce((acc, p) => acc + (p.match(/\b[\w'-]+\b/g)?.length || 0), 0)} words
                  </span>
                </div>

                <div className="space-y-4">
                  {section.paragraphs.map((p, pIdx) => (
                    <div key={pIdx}>
                      <label className="block text-[11px] font-mono-numbers text-stone-500 mb-1">
                        Paragraph {pIdx + 1}
                      </label>
                      <textarea
                        rows={4}
                        value={p}
                        onChange={(e) => {
                          const newSections = [...sections];
                          const newParagraphs = [...newSections[sIdx].paragraphs];
                          newParagraphs[pIdx] = e.target.value;
                          newSections[sIdx] = { ...newSections[sIdx], paragraphs: newParagraphs };
                          setSections(newSections);
                        }}
                        className="w-full p-3 text-sm font-editorial-body text-stone-900 bg-stone-50/50 border border-stone-200 rounded focus:border-stone-500 focus:bg-white focus:outline-none transition-colors"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="my-10 text-center">
            <button
              type="button"
              onClick={() => handleQuickDownload('docx')}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded shadow-sm transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Final DOC File</span>
            </button>
          </div>
        </main>
      )}

      {/* Editorial Footer */}
      <footer className="border-t border-stone-200 bg-[#F7F4EE] py-12 text-stone-600 text-xs font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-editorial-heading text-stone-900 font-bold text-sm">
              The Educational Review
            </span>
            <span>· Academic Monograph & Policy Series</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => handleQuickDownload('docx')}
              className="hover:text-stone-900 transition-colors font-medium cursor-pointer"
            >
              Download DOCX
            </button>
            <button
              type="button"
              onClick={() => handleQuickDownload('doc')}
              className="hover:text-stone-900 transition-colors font-medium cursor-pointer"
            >
              Download DOC
            </button>
            <button
              type="button"
              onClick={() => setIsExportModalOpen(true)}
              className="hover:text-stone-900 transition-colors font-medium cursor-pointer"
            >
              Export Options
            </button>
          </div>
          <div className="text-stone-500 font-mono-numbers">
            Deliverable word count: {textMetrics.wordCount} words
          </div>
        </div>
      </footer>

      {/* Floating Audio Narration Player */}
      <AudioNarrationPlayer
        sections={sections}
        isOpen={isAudioPlayerOpen}
        onClose={() => setIsAudioPlayerOpen(false)}
        onHighlightParagraph={(secId, pIdx) => {
          setHighlightedParagraph({ sectionId: secId, paragraphIndex: pIdx });
          const el = document.getElementById(secId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }}
      />

      {/* Revision Modal */}
      <RevisionEditorModal
        sections={sections}
        isOpen={isRevisionModalOpen}
        onClose={() => setIsRevisionModalOpen(false)}
        onSaveRevision={(newSecs) => setSections(newSecs)}
        onDownloadRevisionDocx={handleDownloadRevisionDocx}
        onResetToDefault={handleResetToDefault}
      />

      {/* Full Export Deliverable Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        sections={sections}
        citations={CITATIONS}
        evidenceTable={COMPARISON_TABLE_DATA}
        wordCount={textMetrics.wordCount}
      />
    </div>
  );
}
