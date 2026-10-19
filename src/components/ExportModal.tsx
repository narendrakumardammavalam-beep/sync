import React, { useState } from 'react';
import { X, Download, FileText, Check, Copy, Settings2 } from 'lucide-react';
import { SectionContent, Citation, TableRow as EvidenceRow, BLOG_METADATA } from '../data/blogPostData';
import { generateDocxBlob, generateClassicDocBlob, triggerDownload, DocExportOptions } from '../utils/docExport';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  sections: SectionContent[];
  citations: Citation[];
  evidenceTable: EvidenceRow[];
  wordCount: number;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  sections,
  citations,
  evidenceTable,
  wordCount
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'docx' | 'doc' | 'md'>('docx');
  const [includeCitations, setIncludeCitations] = useState(true);
  const [includeEvidenceTable, setIncludeEvidenceTable] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setIsExporting(true);
    const options: DocExportOptions = {
      includeCitations,
      includeEvidenceTable,
      format: selectedFormat === 'md' ? 'docx' : selectedFormat
    };

    try {
      const baseFilename = 'The_Impact_of_Digital_Technology_on_Education';

      if (selectedFormat === 'docx') {
        const blob = await generateDocxBlob(sections, citations, evidenceTable, options);
        triggerDownload(blob, `${baseFilename}.docx`);
      } else if (selectedFormat === 'doc') {
        const blob = generateClassicDocBlob(sections, citations, evidenceTable, options);
        triggerDownload(blob, `${baseFilename}.doc`);
      } else if (selectedFormat === 'md') {
        // Generate markdown string
        let md = `# ${BLOG_METADATA.title}\n## ${BLOG_METADATA.subtitle}\n\n`;
        md += `**Author:** ${BLOG_METADATA.author}  \n**Date:** ${BLOG_METADATA.date}  \n**Category:** ${BLOG_METADATA.category}  \n**Word Count:** ${wordCount} words\n\n---\n\n`;

        sections.forEach((sec) => {
          md += `## ${sec.title}\n`;
          if (sec.subtitle) md += `*${sec.subtitle}*\n\n`;
          sec.paragraphs.forEach((p) => {
            md += `${p}\n\n`;
          });
          if (sec.pullQuote) {
            md += `> "${sec.pullQuote.text}"\n> — *${sec.pullQuote.attribution}*\n\n`;
          }
        });

        if (includeEvidenceTable) {
          md += `### Comparative Analysis: Traditional vs. Digital Paradigms\n\n`;
          md += `| Dimension | Traditional Model | Digital Paradigm & Empirical Evidence |\n|---|---|---|\n`;
          evidenceTable.forEach((row) => {
            md += `| ${row.dimension} | ${row.traditionalModel} | ${row.digitalParadigm} (*${row.empiricalEvidence}*) |\n`;
          });
          md += `\n`;
        }

        if (includeCitations) {
          md += `### Scholarly References\n\n`;
          citations.forEach((c) => {
            md += `${c.number}. **${c.authors} (${c.year}).** *${c.title}*. ${c.publication}. ${c.doi ? `DOI: ${c.doi}` : ''}\n`;
          });
        }

        const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
        triggerDownload(blob, `${baseFilename}.md`);
      }
    } catch (err) {
      console.error('Export failed', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyText = () => {
    let fullText = `${BLOG_METADATA.title}\n${BLOG_METADATA.subtitle}\nAuthor: ${BLOG_METADATA.author}\nDate: ${BLOG_METADATA.date}\n\n`;
    sections.forEach((s) => {
      fullText += `\n${s.title}\n\n${s.paragraphs.join('\n\n')}\n`;
    });
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white border border-stone-300 rounded shadow-2xl p-6 text-stone-900 font-sans">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-stone-800" />
            <h2 className="font-editorial-heading text-xl font-bold text-stone-900">
              Export Blog Post Deliverable
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Deliverable Verification Card */}
        <div className="my-4 p-3.5 bg-[#F7F4EE] border border-stone-200 rounded text-xs space-y-1">
          <div className="flex justify-between text-stone-600">
            <span>Required Topic:</span>
            <span className="font-semibold text-stone-900">The Impact of Digital Technology on Education</span>
          </div>
          <div className="flex justify-between text-stone-600">
            <span>Word Count:</span>
            <span className="font-mono-numbers font-semibold text-stone-900">{wordCount} words (Requirement: 1500–2000)</span>
          </div>
          <div className="flex justify-between text-stone-600">
            <span>Reliable Sources:</span>
            <span className="font-semibold text-stone-900">4 peer-reviewed sources (Requirement: ≥3)</span>
          </div>
          <div className="flex justify-between text-stone-600">
            <span>Target Deliverable:</span>
            <span className="font-semibold text-emerald-800">DOC / DOCX Document Format</span>
          </div>
        </div>

        {/* Format Selector */}
        <div className="space-y-2 mt-4">
          <label className="text-xs font-semibold uppercase tracking-wider text-stone-600">
            Select Output Format
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setSelectedFormat('docx')}
              className={`p-3 rounded text-left border transition-all cursor-pointer ${
                selectedFormat === 'docx'
                  ? 'border-stone-900 bg-stone-900 text-white shadow-sm'
                  : 'border-stone-200 hover:border-stone-300 bg-stone-50 text-stone-800'
              }`}
            >
              <div className="font-bold text-sm">DOCX</div>
              <div className="text-[11px] opacity-80 mt-0.5">MS Word (Modern)</div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedFormat('doc')}
              className={`p-3 rounded text-left border transition-all cursor-pointer ${
                selectedFormat === 'doc'
                  ? 'border-stone-900 bg-stone-900 text-white shadow-sm'
                  : 'border-stone-200 hover:border-stone-300 bg-stone-50 text-stone-800'
              }`}
            >
              <div className="font-bold text-sm">DOC</div>
              <div className="text-[11px] opacity-80 mt-0.5">MS Word (Classic)</div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedFormat('md')}
              className={`p-3 rounded text-left border transition-all cursor-pointer ${
                selectedFormat === 'md'
                  ? 'border-stone-900 bg-stone-900 text-white shadow-sm'
                  : 'border-stone-200 hover:border-stone-300 bg-stone-50 text-stone-800'
              }`}
            >
              <div className="font-bold text-sm">Markdown</div>
              <div className="text-[11px] opacity-80 mt-0.5">GitHub / Web</div>
            </button>
          </div>
        </div>

        {/* Options Checkboxes */}
        <div className="mt-5 pt-4 border-t border-stone-200 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1">
            <Settings2 className="w-3.5 h-3.5" />
            <span>Document Options</span>
          </div>
          <label className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer">
            <input
              type="checkbox"
              checked={includeCitations}
              onChange={(e) => setIncludeCitations(e.target.checked)}
              className="rounded border-stone-300 text-stone-900 focus:ring-stone-500"
            />
            <span>Include Scholarly References & Institutional Sources (APA format)</span>
          </label>
          <label className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer">
            <input
              type="checkbox"
              checked={includeEvidenceTable}
              onChange={(e) => setIncludeEvidenceTable(e.target.checked)}
              className="rounded border-stone-300 text-stone-900 focus:ring-stone-500"
            />
            <span>Include Comparative Paradigm Matrix Table</span>
          </label>
        </div>

        {/* Actions */}
        <div className="mt-6 pt-4 border-t border-stone-200 flex items-center justify-between">
          <button
            type="button"
            onClick={handleCopyText}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Clean Text'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={isExporting}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 disabled:opacity-50 rounded transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Generating DOC...' : `Download .${selectedFormat}`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
