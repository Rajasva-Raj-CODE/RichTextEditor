"use client";

import type { Editor } from '@tiptap/react';

export async function exportToPDF(editor: Editor | null) {
  if (!editor) return;

  const content = editor.getHTML();
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;
  tempDiv.style.width = '210mm';
  tempDiv.style.padding = '20mm';
  tempDiv.style.fontFamily = 'Arial, sans-serif';
  document.body.appendChild(tempDiv);

  const { default: jsPDF } = await import('jspdf');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageHeight = pdf.internal.pageSize.getHeight();
  const pageWidth = pdf.internal.pageSize.getWidth();

  const text = tempDiv.innerText;
  const lines = pdf.splitTextToSize(text, pageWidth - 40);

  let cursorY = 20;
  lines.forEach((line: string) => {
    if (cursorY > pageHeight - 20) {
      pdf.addPage();
      cursorY = 20;
    }
    pdf.text(line, 20, cursorY);
    cursorY += 7;
  });

  document.body.removeChild(tempDiv);
  pdf.save('document.pdf');
}

export async function exportToWord(editor: Editor | null) {
  if (!editor) return;

  const content = editor.getHTML();
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Document</title>
      </head>
      <body>
        ${content}
      </body>
    </html>
  `;

  const blob = new Blob([htmlContent], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });
  const { saveAs } = await import('file-saver');
  saveAs(blob, 'document.docx');
}

export async function importWord(editor: Editor | null, file: File) {
  if (!editor) return;
  const arrayBuffer = await file.arrayBuffer();
  const { default: mammoth } = await import('mammoth');
  const result = await mammoth.convertToHtml({ arrayBuffer });
  editor.commands.setContent(result.value);
}


