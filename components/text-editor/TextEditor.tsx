'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import Underline from '@tiptap/extension-underline';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import CharacterCount from '@tiptap/extension-character-count';
import { Extension } from '@tiptap/core';
import { useEffect, useState } from 'react';
import { MenuBar } from './MenuBar';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import mammoth from 'mammoth';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const AUTOSAVE_KEY = 'tiptap-editor-content';


// Custom FontSize extension
const FontSize = Extension.create({
  name: 'fontSize',

  addOptions() {
    return {
      types: ['textStyle'],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize || null,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
        ({ chain }) => {
          return chain().setMark('textStyle', { fontSize }).run();
        },
      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run();
        },
    };
  },
});

export function TextEditor() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sourceViewOpen, setSourceViewOpen] = useState(false);
  const [sourceCode, setSourceCode] = useState('');
  const [zoom, setZoom] = useState(1);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph', 'blockquote', 'codeBlock', 'bulletList', 'orderedList', 'listItem',],
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        defaultProtocol: 'https',
        HTMLAttributes: {
          rel: 'noopener noreferrer nofollow',
          target: '_blank',
        },
        validate: href => /^(https?:\/\/|mailto:|tel:)/i.test(href),
      }),
      Image.configure({
        inline: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      Underline,
      Subscript,
      Superscript,
      TextStyle,
      Color,
      FontSize,
      Highlight.configure({
        multicolor: true,
      }),
      CharacterCount,
    ],
    content: '',
    // Prevent SSR hydration mismatches in Next.js by delaying initial render until mounted
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[900px] p-12',
      },
    },
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedContent = localStorage.getItem(AUTOSAVE_KEY);
      if (savedContent && editor) {
        editor.commands.setContent(savedContent);
      }
    }
  }, [editor]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const exportToPDF = () => {
    if (!editor) return;

    const content = editor.getHTML();
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    tempDiv.style.width = '210mm';
    tempDiv.style.padding = '20mm';
    tempDiv.style.fontFamily = 'Arial, sans-serif';
    document.body.appendChild(tempDiv);

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
  };

  const exportToWord = () => {
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
    saveAs(blob, 'document.docx');
  };

  const importWord = async (file: File) => {
    if (!editor) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      editor.commands.setContent(result.value);
    } catch (error) {
      console.error('Error importing file:', error);
      alert('Error importing file. Please try again.');
    }
  };

  const toggleSourceView = () => {
    if (!sourceViewOpen && editor) {
      setSourceCode(editor.getHTML());
    }
    setSourceViewOpen(!sourceViewOpen);
  };

  const applySourceCode = () => {
    if (editor) {
      editor.commands.setContent(sourceCode);
    }
    setSourceViewOpen(false);
  };


  return (
    <div className="flex flex-col h-screen">
      <MenuBar
        editor={editor}
        onExportPDF={exportToPDF}
        onExportWord={exportToWord}
        onImportWord={importWord}
        onToggleSourceView={toggleSourceView}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        isDarkMode={isDarkMode}
        zoom={zoom}
        onZoomChange={(z) => setZoom(z)}
      />

      <div className="flex-1 overflow-auto bg-muted/30">
        <div className="editor-grid">
          <div className="max-w-5xl mx-auto px-6 py-8">
            <div className="flex justify-center">
              <div
                className="paper bg-white dark:bg-white shadow-xl ring-1 ring-black/5 rounded-lg overflow-hidden"
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: 'top center',
                }}
              >
                <EditorContent editor={editor} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={sourceViewOpen} onOpenChange={setSourceViewOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Source Code View</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <Textarea
              value={sourceCode}
              onChange={(e) => setSourceCode(e.target.value)}
              className="font-mono text-xs min-h-[400px]"
              placeholder="HTML source code..."
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setSourceViewOpen(false)}>
              Cancel
            </Button>
            <Button onClick={applySourceCode}>Apply Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
