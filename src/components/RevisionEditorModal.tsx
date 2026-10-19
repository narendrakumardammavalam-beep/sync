import React, { useState } from 'react';
import { X, CheckCircle2, RotateCcw, Download, Sparkles, AlertTriangle, FileEdit } from 'lucide-react';
import { SectionContent } from '../data/blogPostData';
import { countWords } from '../utils/textMetrics';

interface RevisionEditorModalProps {
  sections: SectionContent[];
  isOpen: boolean;
  onClose: () => void;
  onSaveRevision: (newSections: SectionContent[]) => void;
  onDownloadRevisionDocx: (sectionsToDownload: SectionContent[]) => void;
  onResetToDefault: () => void;
}

export const RevisionEditorModal: React.FC<RevisionEditorModalProps> = ({
  sections,
  isOpen,
  onClose,
  onSaveRevision,
  onDownloadRevisionDocx,
  onResetToDefault
}) => {
  const [editedSections, setEditedSections] = useState<SectionContent[]>(sections);
  const [activeSectionId, setActiveSectionId] = useState<string>(sections[0]?.id || '');

  if (!isOpen) return null;

  // Calculate live word count of all edited sections
  const totalEditedWords = editedSections.reduce((acc, sec) => {
    return acc + countWords(sec.paragraphs.join(' '));
  }, 0);

  const meetsTarget = totalEditedWords >= 1500 && totalEditedWords <= 2000;

  const handleParagraphChange = (sectionId: string, paragraphIndex: number, newText: string) => {
    setEditedSections((prev) =>
      prev.map((sec) => {
        if (sec.id !== sectionId) return sec;
        const newParagraphs = [...sec.paragraphs];
        newParagraphs[paragraphIndex] = newText;
        return { ...sec, paragraphs: newParagraphs };
      })
    );
  };

  const handleApplyChanges = () => {
    onSaveRevision(editedSections);
    onClose();
  };

  const currentSection = editedSections.find((s) => s.id === activeSectionId) || editedSections[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-5xl bg-white border border-stone-300 rounded shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-stone-900 font-sans">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-[#FBF9F5]">
          <div>
            <div className="flex items-center gap-2">
              <FileEdit className="w-4 h-4 text-stone-800" />
              <h2 className="font-editorial-heading text-lg font-bold text-stone-900">
                Post Revision & Quality Control Workspace
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Step 4: Review, refine text phrasing, and verify 1,500–2,000 word deliverable constraints.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Live Word Count Indicator */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono-numbers ${
                meetsTarget
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              <span className="font-bold">{totalEditedWords} words</span>
              <span>/ Target 1,500–2,000</span>
              {meetsTarget ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1 text-stone-400 hover:text-stone-700 rounded transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 4 Steps Banner */}
        <div className="px-6 py-2.5 bg-stone-100/80 border-b border-stone-200 grid grid-cols-4 gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-stone-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span className="font-medium">1. Research</span>
          </div>
          <div className="flex items-center gap-1.5 text-stone-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span className="font-medium">2. Plan Structure</span>
          </div>
          <div className="flex items-center gap-1.5 text-stone-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span className="font-medium">3. Draft Post</span>
          </div>
          <div className="flex items-center gap-1.5 text-stone-900 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-stone-900 shrink-0" />
            <span>4. Revise & Polish</span>
          </div>
        </div>

        {/* Body Split View */}
        <div className="flex flex-1 overflow-hidden">
          {/* Section Picker Sidebar */}
          <div className="w-1/3 border-r border-stone-200 bg-[#F7F4EE]/50 overflow-y-auto p-4 space-y-1.5">
            <div className="text-[11px] uppercase tracking-wider font-semibold text-stone-500 mb-2 px-2">
              Sections to Revise
            </div>
            {editedSections.map((sec, idx) => {
              const secWords = countWords(sec.paragraphs.join(' '));
              const isActive = sec.id === currentSection.id;
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setActiveSectionId(sec.id)}
                  className={`w-full text-left p-2.5 rounded text-xs transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-white shadow-sm border border-stone-300 font-semibold text-stone-950'
                      : 'text-stone-600 hover:bg-stone-200/60'
                  }`}
                >
                  <div className="truncate">{sec.title}</div>
                  <div className="text-[11px] font-mono-numbers text-stone-500 mt-0.5">
                    {secWords} words · {sec.paragraphs.length} paragraphs
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Section Paragraphs Editor */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div>
              <h3 className="font-editorial-heading text-lg font-bold text-stone-900">
                {currentSection.title}
              </h3>
              {currentSection.subtitle && (
                <p className="text-xs text-stone-500 italic mt-0.5">{currentSection.subtitle}</p>
              )}
            </div>

            <div className="space-y-4">
              {currentSection.paragraphs.map((para, pIdx) => {
                const paraWordCount = countWords(para);
                return (
                  <div key={pIdx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-stone-500 font-mono-numbers">
                      <span>Paragraph {pIdx + 1}</span>
                      <span>{paraWordCount} words</span>
                    </div>
                    <textarea
                      rows={5}
                      value={para}
                      onChange={(e) => handleParagraphChange(currentSection.id, pIdx, e.target.value)}
                      className="w-full p-3 text-xs sm:text-sm font-editorial-body text-stone-900 leading-relaxed bg-white border border-stone-300 rounded focus:border-stone-600 focus:ring-1 focus:ring-stone-600 focus:outline-none transition-all resize-y"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-stone-200 bg-[#FBF9F5] flex items-center justify-between">
          <button
            type="button"
            onClick={onResetToDefault}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 rounded hover:bg-stone-200/60 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Standard Draft</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onDownloadRevisionDocx(editedSections)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-stone-800 bg-stone-100 hover:bg-stone-200 rounded border border-stone-300 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export DOC from This Revision</span>
            </button>
            <button
              type="button"
              onClick={handleApplyChanges}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Save & Update Reading View</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
