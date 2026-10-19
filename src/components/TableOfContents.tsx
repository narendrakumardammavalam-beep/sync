import React from 'react';
import { SectionContent } from '../data/blogPostData';
import { List } from 'lucide-react';

interface TableOfContentsProps {
  sections: SectionContent[];
  activeSectionId: string;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  sections,
  activeSectionId
}) => {
  return (
    <nav className="p-4 bg-stone-100/50 border border-stone-200/80 rounded font-sans text-xs">
      <div className="flex items-center gap-1.5 font-semibold uppercase tracking-wider text-stone-500 mb-3 pb-2 border-b border-stone-200">
        <List className="w-3.5 h-3.5" />
        <span>Contents & Chapters</span>
      </div>

      <ul className="space-y-1">
        {sections.map((section, idx) => {
          const isActive = section.id === activeSectionId;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className={`block py-1.5 px-2 rounded transition-colors ${
                  isActive
                    ? 'bg-stone-900 text-white font-medium'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                }`}
              >
                <div className="truncate">{section.title}</div>
              </a>
            </li>
          );
        })}
        <li className="pt-2 border-t border-stone-200 mt-2">
          <a
            href="#evidence-section"
            className="block py-1 px-2 text-stone-600 hover:text-stone-900 hover:bg-stone-200/50 rounded transition-colors"
          >
            Comparative Paradigm Matrix
          </a>
        </li>
        <li>
          <a
            href="#sources-section"
            className="block py-1 px-2 text-stone-600 hover:text-stone-900 hover:bg-stone-200/50 rounded transition-colors"
          >
            Scholarly Citations (4 Sources)
          </a>
        </li>
      </ul>
    </nav>
  );
};
