/**
 * Professional Microsoft Word DOC / DOCX Export Service
 * Produces structured, styled Word documents adhering to the publication brief.
 */

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  BorderStyle,
  WidthType,
  AlignmentType,
  ShadingType,
  Footer,
  Header,
  PageNumber
} from 'docx';
import { BLOG_METADATA, SectionContent, Citation, TableRow as EvidenceRow } from '../data/blogPostData';

export interface DocExportOptions {
  includeCitations?: boolean;
  includeEvidenceTable?: boolean;
  includeMetaBlock?: boolean;
  format?: 'docx' | 'doc';
  customTitle?: string;
  customAuthor?: string;
}

/**
 * Generates an authentic DOCX file using the OpenXML standard.
 */
export async function generateDocxBlob(
  sections: SectionContent[],
  citations: Citation[],
  evidenceTable: EvidenceRow[],
  options: DocExportOptions = {}
): Promise<Blob> {
  const title = options.customTitle || BLOG_METADATA.title;
  const author = options.customAuthor || BLOG_METADATA.author;
  const includeCitations = options.includeCitations ?? true;
  const includeEvidenceTable = options.includeEvidenceTable ?? true;

  const docChildren: (Paragraph | Table)[] = [];

  // Title Block
  docChildren.push(
    new Paragraph({
      text: title,
      heading: HeadingLevel.TITLE,
      spacing: { after: 120, before: 240 },
      alignment: AlignmentType.CENTER
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: BLOG_METADATA.subtitle,
          italics: true,
          size: 24, // 12pt
          color: '555555'
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 360 }
    }),
    new Paragraph({
      children: [
        new TextRun({ text: `Author: `, bold: true }),
        new TextRun({ text: `${author}  |  ` }),
        new TextRun({ text: `Date: `, bold: true }),
        new TextRun({ text: `${BLOG_METADATA.date}  |  ` }),
        new TextRun({ text: `Topic: `, bold: true }),
        new TextRun({ text: `${BLOG_METADATA.category}` })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 480 }
    })
  );

  // Divider / Horizontal rule
  docChildren.push(
    new Paragraph({
      text: '',
      border: {
        bottom: {
          color: 'CCCCCC',
          space: 1,
          style: BorderStyle.SINGLE,
          size: 6
        }
      },
      spacing: { after: 360 }
    })
  );

  // Sections
  sections.forEach((section) => {
    // Section Heading
    docChildren.push(
      new Paragraph({
        text: section.title,
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 360, after: 120 }
      })
    );

    if (section.subtitle) {
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: section.subtitle,
              italics: true,
              color: '444444',
              size: 22
            })
          ],
          spacing: { after: 200 }
        })
      );
    }

    // Paragraphs
    section.paragraphs.forEach((p) => {
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: p,
              size: 23 // 11.5pt
            })
          ],
          spacing: { after: 180, line: 300 } // 1.25 line spacing
        })
      );
    });

    // Pull quote if present
    if (section.pullQuote) {
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `“${section.pullQuote.text}”`,
              italics: true,
              bold: true,
              color: '2C3E50',
              size: 23
            }),
            new TextRun({
              text: `\n— ${section.pullQuote.attribution}`,
              italics: true,
              size: 20,
              color: '666666'
            })
          ],
          indent: { left: 720, right: 720 },
          spacing: { before: 200, after: 240 },
          border: {
            left: {
              color: 'B08968',
              space: 12,
              style: BorderStyle.SINGLE,
              size: 18
            }
          }
        })
      );
    }
  });

  // Evidence Table
  if (includeEvidenceTable && evidenceTable.length > 0) {
    docChildren.push(
      new Paragraph({
        text: 'Comparative Educational Dimensions & Empirical Evidence',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 }
      })
    );

    const tableRows = [
      new TableRow({
        tableHeader: true,
        children: [
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, fill: 'EFEAE1' },
            children: [new Paragraph({ children: [new TextRun({ text: 'Dimension', bold: true, size: 20 })] })]
          }),
          new TableCell({
            width: { size: 35, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, fill: 'EFEAE1' },
            children: [new Paragraph({ children: [new TextRun({ text: 'Traditional Instruction', bold: true, size: 20 })] })]
          }),
          new TableCell({
            width: { size: 40, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, fill: 'EFEAE1' },
            children: [new Paragraph({ children: [new TextRun({ text: 'Digital Paradigm & Impact', bold: true, size: 20 })] })]
          })
        ]
      }),
      ...evidenceTable.map((row) =>
        new TableRow({
          children: [
            new TableCell({
              width: { size: 25, type: WidthType.PERCENTAGE },
              children: [new Paragraph({ children: [new TextRun({ text: row.dimension, bold: true, size: 19 })] })]
            }),
            new TableCell({
              width: { size: 35, type: WidthType.PERCENTAGE },
              children: [new Paragraph({ children: [new TextRun({ text: row.traditionalModel, size: 19 })] })]
            }),
            new TableCell({
              width: { size: 40, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({ children: [new TextRun({ text: row.digitalParadigm, size: 19 })] }),
                new Paragraph({
                  children: [new TextRun({ text: `Evidence: ${row.empiricalEvidence}`, italics: true, size: 18, color: '555555' })],
                  spacing: { before: 80 }
                })
              ]
            })
          ]
        })
      )
    ];

    docChildren.push(
      new Table({
        rows: tableRows,
        width: { size: 100, type: WidthType.PERCENTAGE }
      })
    );
  }

  // Citations & References Section
  if (includeCitations && citations.length > 0) {
    docChildren.push(
      new Paragraph({
        text: 'Scholarly References & Institutional Sources',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 480, after: 180 }
      })
    );

    citations.forEach((cit) => {
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({ text: `[${cit.number}] `, bold: true }),
            new TextRun({ text: `${cit.authors} (${cit.year}). `, bold: true }),
            new TextRun({ text: `${cit.title}. `, italics: true }),
            new TextRun({ text: `${cit.publication}. ` }),
            ...(cit.doi ? [new TextRun({ text: `DOI: ${cit.doi}. `, color: '0066CC' })] : []),
            ...(cit.url ? [new TextRun({ text: `Available at: ${cit.url}`, color: '0066CC' })] : [])
          ],
          spacing: { after: 120 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `Key Finding: `, bold: true, size: 19, color: '555555' }),
            new TextRun({ text: cit.keyFindings, size: 19, color: '555555' })
          ],
          indent: { left: 360 },
          spacing: { after: 200 }
        })
      );
    });
  }

  const doc = new Document({
    creator: author,
    title: title,
    description: BLOG_METADATA.subtitle,
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440
            }
          }
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                text: 'The Educational Review  |  Scholarly Research Series',
                alignment: AlignmentType.RIGHT
              })
            ]
          })
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: 'The Impact of Digital Technology on Education — Page ' }),
                  new TextRun({ children: [PageNumber.CURRENT] }),
                  new TextRun({ text: ' of ' }),
                  new TextRun({ children: [PageNumber.TOTAL_PAGES] })
                ],
                alignment: AlignmentType.CENTER
              })
            ]
          })
        },
        children: docChildren
      }
    ]
  });

  return await Packer.toBlob(doc);
}

/**
 * Generates a classic .doc format file (Mime application/msword with standard Word XML/HTML)
 * to ensure 100% compatibility across legacy systems and web word processors.
 */
export function generateClassicDocBlob(
  sections: SectionContent[],
  citations: Citation[],
  evidenceTable: EvidenceRow[],
  options: DocExportOptions = {}
): Blob {
  const title = options.customTitle || BLOG_METADATA.title;
  const author = options.customAuthor || BLOG_METADATA.author;

  let bodyHtml = `
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="font-family: 'Times New Roman', serif; font-size: 26pt; font-weight: bold; margin-bottom: 8px; color: #111827;">${title}</h1>
      <p style="font-family: 'Times New Roman', serif; font-size: 14pt; font-style: italic; color: #4B5563; margin-bottom: 16px;">${BLOG_METADATA.subtitle}</p>
      <p style="font-family: Arial, sans-serif; font-size: 10pt; color: #6B7280;">
        <strong>Author:</strong> ${author} &nbsp;|&nbsp;
        <strong>Date:</strong> ${BLOG_METADATA.date} &nbsp;|&nbsp;
        <strong>Field:</strong> ${BLOG_METADATA.category}
      </p>
      <hr style="border: 0; border-bottom: 1px solid #D1D5DB; margin-top: 24px; margin-bottom: 30px;" />
    </div>
  `;

  sections.forEach((section) => {
    bodyHtml += `
      <div style="margin-bottom: 24px;">
        <h2 style="font-family: 'Times New Roman', serif; font-size: 16pt; font-weight: bold; color: #1F2937; margin-top: 24px; margin-bottom: 6px;">${section.title}</h2>
        ${section.subtitle ? `<p style="font-family: 'Times New Roman', serif; font-size: 11pt; font-style: italic; color: #4B5563; margin-bottom: 14px;">${section.subtitle}</p>` : ''}
    `;

    section.paragraphs.forEach((p) => {
      bodyHtml += `<p style="font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6; color: #111827; margin-bottom: 14px; text-align: justify;">${p}</p>`;
    });

    if (section.pullQuote) {
      bodyHtml += `
        <div style="margin: 20px 40px; padding: 12px 20px; border-left: 4px solid #B08968; background-color: #F9FAFB;">
          <p style="font-family: 'Times New Roman', serif; font-size: 12pt; font-style: italic; font-weight: bold; color: #1F2937; margin: 0 0 6px 0;">“${section.pullQuote.text}”</p>
          <p style="font-family: Arial, sans-serif; font-size: 9pt; color: #6B7280; margin: 0;">— ${section.pullQuote.attribution}</p>
        </div>
      `;
    }

    bodyHtml += `</div>`;
  });

  // Table
  bodyHtml += `
    <div style="margin-top: 36px; margin-bottom: 30px;">
      <h3 style="font-family: 'Times New Roman', serif; font-size: 14pt; font-weight: bold; color: #1F2937; margin-bottom: 12px;">Comparative Analysis: Traditional vs. Digital Paradigms</h3>
      <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt;" border="1" cellpadding="8" cellspacing="0" bordercolor="#D1D5DB">
        <tr style="background-color: #F3F4F6;">
          <th style="text-align: left; padding: 8px;">Dimension</th>
          <th style="text-align: left; padding: 8px;">Traditional Model</th>
          <th style="text-align: left; padding: 8px;">Digital Paradigm & Empirical Evidence</th>
        </tr>
  `;

  evidenceTable.forEach((row) => {
    bodyHtml += `
      <tr>
        <td style="padding: 8px; font-weight: bold; vertical-align: top;">${row.dimension}</td>
        <td style="padding: 8px; vertical-align: top;">${row.traditionalModel}</td>
        <td style="padding: 8px; vertical-align: top;">
          ${row.digitalParadigm}
          <div style="margin-top: 6px; font-size: 9pt; color: #4B5563; font-style: italic;"><strong>Evidence:</strong> ${row.empiricalEvidence}</div>
        </td>
      </tr>
    `;
  });

  bodyHtml += `</table></div>`;

  // Citations
  bodyHtml += `
    <div style="margin-top: 40px;">
      <h3 style="font-family: 'Times New Roman', serif; font-size: 14pt; font-weight: bold; color: #1F2937; margin-bottom: 16px;">Scholarly References & Institutional Sources</h3>
      <ol style="font-family: 'Times New Roman', serif; font-size: 11pt; line-height: 1.5; color: #1F2937; padding-left: 20px;">
  `;

  citations.forEach((cit) => {
    bodyHtml += `
      <li style="margin-bottom: 14px;">
        <strong>${cit.authors} (${cit.year}).</strong> <em>${cit.title}.</em> ${cit.publication}.
        ${cit.doi ? `<div><span style="font-size: 9pt; color: #2563EB;">DOI: ${cit.doi}</span></div>` : ''}
        ${cit.url ? `<div><span style="font-size: 9pt; color: #2563EB;">URL: ${cit.url}</span></div>` : ''}
        <div style="font-size: 10pt; color: #4B5563; margin-top: 4px;"><strong>Key Finding:</strong> ${cit.keyFindings}</div>
      </li>
    `;
  });

  bodyHtml += `</ol></div>`;

  const htmlDocument = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          @page {
            size: 8.5in 11.0in;
            margin: 1.0in 1.0in 1.0in 1.0in;
            mso-header-margin: 0.5in;
            mso-footer-margin: 0.5in;
          }
          body {
            font-family: 'Times New Roman', Georgia, serif;
          }
        </style>
      </head>
      <body>
        ${bodyHtml}
      </body>
    </html>
  `;

  return new Blob(['\ufeff', htmlDocument], {
    type: 'application/msword;charset=utf-8'
  });
}

/**
 * Triggers file download in browser
 */
export function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
