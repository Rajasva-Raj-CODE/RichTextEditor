"use client";

import type { Editor } from '@tiptap/react';

export function FooterStats({ editor }: { editor: Editor }) {
  return (
    <div className="flex justify-end px-3 py-1 text-xs text-muted-foreground border-t bg-background/80">
      <span className="mr-3">Words: {editor.storage.characterCount?.words?.() ?? 0}</span>
      <span>Characters: {editor.storage.characterCount?.characters?.() ?? 0}</span>
    </div>
  );
}


