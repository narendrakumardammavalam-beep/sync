import React from 'react';
import { TableRow } from '../data/blogPostData';
import { Database } from 'lucide-react';

interface EvidenceTableProps {
  data: TableRow[];
}

export const EvidenceTable: React.FC<EvidenceTableProps> = ({ data }) => {
  return (
    <section id="evidence-section" className="my-16 pt-8 border-t border-stone-200">
      <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-stone-500 font-semibold mb-2">
        <Database className="w-3.5 h-3.5" />
        <span>Empirical Synthesis</span>
      </div>
      <h2 className="font-editorial-heading text-2xl lg:text-3xl font-bold text-stone-900 mb-3">
        Comparative Paradigm Matrix: Traditional vs. Digital Education
      </h2>
      <p className="font-editorial-body text-sm text-stone-600 mb-6 max-w-2xl">
        Systematic juxtaposition of legacy pedagogical constraints against digital capabilities, substantiated by verified institutional benchmarks.
      </p>

      <div className="overflow-x-auto border border-stone-300 rounded bg-white">
        <table className="w-full text-left border-collapse text-xs sm:text-sm font-sans">
          <thead>
            <tr className="bg-[#F7F4EE] border-b border-stone-300 text-stone-800">
              <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px] w-1/4">
                Educational Dimension
              </th>
              <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px] w-1/3">
                Traditional Industrial Model
              </th>
              <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px] w-5/12">
                Digital Paradigm & Empirical Evidence
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 font-editorial-body">
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-stone-50/70 transition-colors">
                <td className="py-3.5 px-4 font-sans font-semibold text-stone-900 align-top">
                  {row.dimension}
                </td>
                <td className="py-3.5 px-4 text-stone-700 align-top leading-relaxed">
                  {row.traditionalModel}
                </td>
                <td className="py-3.5 px-4 text-stone-900 align-top leading-relaxed">
                  <div>{row.digitalParadigm}</div>
                  <div className="mt-1.5 font-sans text-xs text-stone-500 font-mono-numbers">
                    <span className="font-semibold text-stone-700">Benchmark: </span>
                    {row.empiricalEvidence}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="font-sans text-[11px] text-stone-500 mt-2 text-right">
        Aggregated from UNESCO GEM Report (2023), OECD Digital Education Outlook (2023), and World Economic Forum (2024).
      </p>
    </section>
  );
};
