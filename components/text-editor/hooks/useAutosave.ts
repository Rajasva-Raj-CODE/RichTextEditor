"use client";

import { useEffect } from 'react';
import type { Editor } from '@tiptap/react';

export function useAutosave(editor: Editor | null, key: string, delayMs = 500) {
  useEffect(() => {
    if (!editor) return;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const saveContent = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const html = editor.getHTML();
        localStorage.setItem(key, html);
      }, delayMs);
    };

    editor.on('update', saveContent);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      editor.off('update', saveContent);
    };
  }, [editor, key, delayMs]);
}


