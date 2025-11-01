"use client";

import type { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Group } from './Group';

export function TableControls({ editor }: { editor: Editor }) {
  if (!editor.isActive('table')) return null;
  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-t bg-muted/50 text-sm">
      <span className="font-semibold text-foreground/80 mr-2">Table:</span>
      <Group>
        <Button variant="secondary" size="sm" className="h-7 text-xs" onClick={() => editor.chain().focus().addRowBefore().run()}>Row Before</Button>
        <Button variant="secondary" size="sm" className="h-7 text-xs" onClick={() => editor.chain().focus().addRowAfter().run()}>Row After</Button>
        <Button variant="default" className="bg-red-500 hover:bg-red-600 text-white h-7 text-xs" size="sm" onClick={() => editor.chain().focus().deleteRow().run()}>Delete Row</Button>
      </Group>
      <Separator orientation="vertical" className="h-6 mx-1" />
      <Group>
        <Button variant="secondary" size="sm" className="h-7 text-xs" onClick={() => editor.chain().focus().addColumnBefore().run()}>Col Before</Button>
        <Button variant="secondary" size="sm" className="h-7 text-xs" onClick={() => editor.chain().focus().addColumnAfter().run()}>Col After</Button>
        <Button variant="default" className="bg-red-500 hover:bg-red-600 text-white h-7 text-xs" size="sm" onClick={() => editor.chain().focus().deleteColumn().run()}>Delete Col</Button>
      </Group>
      <Separator orientation="vertical" className="h-6 mx-1" />
      <Group>
        <Button variant="secondary" size="sm" className="h-7 text-xs" onClick={() => editor.chain().focus().mergeCells().run()}>Merge Cells</Button>
        <Button variant="secondary" size="sm" className="h-7 text-xs" onClick={() => editor.chain().focus().splitCell().run()}>Split Cell</Button>
        <Button variant="default" className="bg-red-700 hover:bg-red-800 text-white h-7 text-xs" size="sm" onClick={() => editor.chain().focus().deleteTable().run()}>Delete Table</Button>
      </Group>
    </div>
  );
}


