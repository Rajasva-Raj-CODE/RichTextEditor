"use client";

import { useMemo } from 'react';
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
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { Extension } from '@tiptap/core';

// Local custom extensions are provided by the parent module via import
import { FontSize, FontFamily, LetterSpacing, LineHeight } from '../extensions';

export function useEditorConfig() {
  const extensions = useMemo(() => [
    StarterKit.configure({
      heading: { levels: [1, 2, 3, 4, 5, 6] },
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph', 'blockquote', 'codeBlock', 'bulletList', 'orderedList', 'listItem'],
    }),
    Link.configure({
      openOnClick: false,
      autolink: true,
      linkOnPaste: true,
      defaultProtocol: 'https',
      HTMLAttributes: { rel: 'noopener noreferrer nofollow', target: '_blank' },
      validate: (href: string) => /^(https?:\/\/|mailto:|tel:)/i.test(href),
    }),
    Image.configure({ inline: true }),
    Table.configure({ resizable: true }),
    TableRow,
    TableCell,
    TableHeader,
    Underline,
    Subscript,
    Superscript,
    TextStyle,
    Color,
    FontSize,
    FontFamily,
    LetterSpacing,
    LineHeight,
    Highlight.configure({ multicolor: true }),
    TaskList,
    TaskItem.configure({ nested: true }),
    CharacterCount,
  ], []);

  const editorProps = useMemo(() => ({
    attributes: {
      class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[900px] p-12',
    },
  }), []);

  return { extensions, editorProps };
}


