import React from 'react';
import { CheckCircle2, AlertTriangle, Download, FileText, BarChart2 } from 'lucide-react';
import { TextMetrics } from '../utils/textMetrics';

interface WordCountInspectorProps {
  metrics: TextMetrics;
  onDownloadDocx: () => void;
  onOpenRevision: () => void;
}

export const WordCountInspector: React.FC<WordCountInspectorProps> = ({
  metrics,
  onDownloadDocx,
  onOpenRevision
}) => {
  // Target: 1500 to 2000
  const minTarget = 1500;
  const maxTarget = 2000;
  const percentageOfTarget = Math.min(100, Math.round((metrics.wordCount / maxTarget) * 100));

  return (
    <div className="bg-[#F7F4EE] border border-stone-200/90 rounded p-5 text-stone-900 font-sans">
      <div className="flex items-center justify-between pb-3 border-b border-stone-300">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-700">
          <BarChart2 className="w-3.5 h-3.5" />
          <span>Editorial Deliverable Audit</span>
        </div>
        {metrics.meetsWordCountRequirement ? (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Verified Target
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-800">
            <AlertTriangle className="w-3.5 h-3.5" />
            {metrics.statusMessage}
          </span>
        )}
      </div>

      {/* Primary Word Metric */}
      <div className="py-4">
        <div className="flex items-baseline justify-between">
          <div className="font-editorial-heading text-3xl font-bold text-stone-900 font-mono-numbers">
            {metrics.wordCount}
          </div>
          <div className="text-xs text-stone-500 font-mono-numbers">
            Target: 1,500 – 2,000 words
          </div>
        </div>

        {/* Target Range Progress Track */}
        <div className="mt-3 relative w-full h-2 bg-stone-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              metrics.meetsWordCountRequirement ? 'bg-stone-800' : 'bg-amber-600'
            }`}
            style={{ width: `${percentageOfTarget}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-stone-500 font-mono-numbers mt-1.5">
          <span>0</span>
          <span className="font-medium text-stone-700">1,500 (Min)</span>
          <span className="font-medium text-stone-700">2,000 (Max)</span>
        </div>
      </div>

      {/* Structural Metrics Breakdown */}
      <dl className="grid grid-cols-2 gap-3 py-3 border-t border-stone-200 text-xs">
        <div>
          <dt className="text-stone-500">Reading Time</dt>
          <dd className="font-medium text-stone-800 font-mono-numbers">
            ~{metrics.readingTimeMinutes} minutes
          </dd>
        </div>
        <div>
          <dt className="text-stone-500">Total Paragraphs</dt>
          <dd className="font-medium text-stone-800 font-mono-numbers">
            {metrics.paragraphCount} paragraphs
          </dd>
        </div>
        <div>
          <dt className="text-stone-500">Readability Ease</dt>
          <dd className="font-medium text-stone-800 font-mono-numbers">
            {metrics.fleschReadingEase} / 100
          </dd>
        </div>
        <div>
          <dt className="text-stone-500">Academic Level</dt>
          <dd className="font-medium text-stone-800 font-mono-numbers">
            Grade {metrics.fleschKincaidGrade} (Collegiate)
          </dd>
        </div>
      </dl>

      {/* Required Deliverable CTA */}
      <div className="mt-4 pt-3 border-t border-stone-200 space-y-2">
        <button
          type="button"
          onClick={onDownloadDocx}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Final Deliverable (.docx)</span>
        </button>
        <button
          type="button"
          onClick={onOpenRevision}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-medium text-stone-700 hover:text-stone-900 bg-white border border-stone-200 rounded hover:bg-stone-50 transition-colors cursor-pointer"
        >
          <FileText className="w-3 h-3" />
          <span>Edit & Revise Essay</span>
        </button>
      </div>
    </div>
  );
};
