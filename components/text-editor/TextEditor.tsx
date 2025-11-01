'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { useCallback, useEffect, useState } from 'react';
import { MenuBar } from './MenuBar';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useEditorConfig } from './hooks/useEditorConfig';
import { useAutosave } from './hooks/useAutosave';
import { exportToPDF as exportPDFUtil, exportToWord as exportWordUtil, importWord as importWordUtil } from './utils/exporters';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const AUTOSAVE_KEY = 'tiptap-editor-content';

export function TextEditor() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sourceViewOpen, setSourceViewOpen] = useState(false);
  const [sourceCode, setSourceCode] = useState('');
  const [zoom, setZoom] = useState(1);

  const { extensions, editorProps } = useEditorConfig();

  const editor = useEditor({
    extensions,
    content: '',
    // Prevent SSR hydration mismatches in Next.js by delaying initial render until mounted
    immediatelyRender: false,
    editorProps,
  });

  // Restore autosaved content on mount
  useEffect(() => {
    if (!editor) return;
    
    const savedContent = localStorage.getItem(AUTOSAVE_KEY);
    if (savedContent && savedContent !== '<p></p>') {
      editor.commands.setContent(savedContent);
    }
  }, [editor]);

  useAutosave(editor, AUTOSAVE_KEY, 500);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const exportToPDF = useCallback(async () => {
    await exportPDFUtil(editor);
  }, [editor]);

  const exportToWord = useCallback(async () => {
    await exportWordUtil(editor);
  }, [editor]);

  const importWord = useCallback(async (file: File) => {
    try {
      await importWordUtil(editor, file);
    } catch (error) {
      console.error('Error importing file:', error);
      alert('Error importing file. Please try again.');
    }
  }, [editor]);

  const toggleSourceView = useCallback(() => {
    if (!sourceViewOpen && editor) {
      setSourceCode(editor.getHTML());
    }
    setSourceViewOpen(!sourceViewOpen);
  }, [editor, sourceViewOpen]);

  const applySourceCode = useCallback(() => {
    if (editor) {
      editor.commands.setContent(sourceCode);
    }
    setSourceViewOpen(false);
  }, [editor, sourceCode]);


  return (
    <div className="flex flex-col h-screen">
      <MenuBar
        editor={editor}
        onExportPDF={exportToPDF}
        onExportWord={exportToWord}
        onImportWord={importWord}
        onToggleSourceView={toggleSourceView}
        onToggleTheme={useCallback(() => setIsDarkMode(!isDarkMode), [isDarkMode])}
        isDarkMode={isDarkMode}
        zoom={zoom}
        onZoomChange={useCallback((z: number) => setZoom(z), [])}
      />

      <div className="flex-1 overflow-auto bg-muted/30">
        <div className="editor-grid">
          <div className="max-w-7xl mx-auto px-2 py-8">
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
