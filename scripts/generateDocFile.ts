import fs from 'fs';
import path from 'path';
import { BLOG_SECTIONS, CITATIONS, COMPARISON_TABLE_DATA, BLOG_METADATA } from '../src/data/blogPostData.ts';
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

async function buildDocx() {
  const docChildren = [];

  // Title Block
  docChildren.push(
    new Paragraph({
      text: BLOG_METADATA.title,
      heading: HeadingLevel.TITLE,
      spacing: { after: 120, before: 240 },
      alignment: AlignmentType.CENTER
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: BLOG_METADATA.subtitle,
          italics: true,
          size: 24,
          color: '555555'
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 360 }
    }),
    new Paragraph({
      children: [
        new TextRun({ text: 'Author: ', bold: true }),
        new TextRun({ text: `${BLOG_METADATA.author}  |  ` }),
        new TextRun({ text: 'Date: ', bold: true }),
        new TextRun({ text: `${BLOG_METADATA.date}  |  ` }),
        new TextRun({ text: 'Category: ', bold: true }),
        new TextRun({ text: `${BLOG_METADATA.category}` })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 480 }
    }),
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
  BLOG_SECTIONS.forEach((section) => {
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

    section.paragraphs.forEach((p) => {
      docChildren.push(
        new Paragraph({
          children: [new TextRun({ text: p, size: 23 })],
          spacing: { after: 180, line: 300 }
        })
      );
    });

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

  // Table
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
    ...COMPARISON_TABLE_DATA.map(
      (row) =>
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
    new Paragraph({
      text: 'Comparative Educational Dimensions & Empirical Evidence',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 }
    }),
    new Table({
      rows: tableRows,
      width: { size: 100, type: WidthType.PERCENTAGE }
    })
  );

  // References
  docChildren.push(
    new Paragraph({
      text: 'Scholarly References & Institutional Sources',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 480, after: 180 }
    })
  );

  CITATIONS.forEach((cit) => {
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
          new TextRun({ text: 'Key Finding: ', bold: true, size: 19, color: '555555' }),
          new TextRun({ text: cit.keyFindings, size: 19, color: '555555' })
        ],
        indent: { left: 360 },
        spacing: { after: 200 }
      })
    );
  });

  const doc = new Document({
    creator: BLOG_METADATA.author,
    title: BLOG_METADATA.title,
    description: BLOG_METADATA.subtitle,
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
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

  const buffer = await Packer.toBuffer(doc);
  const outDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const outDocx = path.join(outDir, 'The_Impact_of_Digital_Technology_on_Education.docx');
  fs.writeFileSync(outDocx, buffer);
  console.log('Successfully wrote:', outDocx);

  // Generate classic .doc HTML/MSO Word file
  let docContent = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
  <head><meta charset='utf-8'><title>${BLOG_METADATA.title}</title></head>
  <body style="font-family: 'Times New Roman', serif; padding: 40px;">
    <h1 style="text-align: center; font-size: 24pt;">${BLOG_METADATA.title}</h1>
    <p style="text-align: center; font-style: italic; color: #555;">${BLOG_METADATA.subtitle}</p>
    <p style="text-align: center; font-size: 10pt;">Author: ${BLOG_METADATA.author} | Date: ${BLOG_METADATA.date}</p>
    <hr/>
  `;
  BLOG_SECTIONS.forEach(s => {
    docContent += `<h2>${s.title}</h2>`;
    if (s.subtitle) docContent += `<p><em>${s.subtitle}</em></p>`;
    s.paragraphs.forEach(p => {
      docContent += `<p style="line-height: 1.6; text-align: justify;">${p}</p>`;
    });
    if (s.pullQuote) {
      docContent += `<blockquote style="border-left: 3px solid #b08968; padding-left: 16px; margin: 20px 0; font-style: italic;">"${s.pullQuote.text}"<br/>— ${s.pullQuote.attribution}</blockquote>`;
    }
  });
  docContent += `<h3>Scholarly References</h3><ol>`;
  CITATIONS.forEach(c => {
    docContent += `<li><strong>${c.authors} (${c.year}).</strong> <em>${c.title}</em>. ${c.publication}.</li>`;
  });
  docContent += `</ol></body></html>`;

  const outDoc = path.join(outDir, 'The_Impact_of_Digital_Technology_on_Education.doc');
  fs.writeFileSync(outDoc, '\ufeff' + docContent, 'utf-8');
  console.log('Successfully wrote:', outDoc);
}

buildDocx().catch(console.error);
