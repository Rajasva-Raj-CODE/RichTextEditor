"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Editor } from '@tiptap/react';
import { Group } from './Group';

export function HeadingFontGroup({
  editor,
  activeHeading,
  setActiveHeading,
  activeFontSize,
  setActiveFontSize,
  activeFontFamily,
  setActiveFontFamily,
  activeLetterSpacing,
  setActiveLetterSpacing,
  activeLineHeight,
  setActiveLineHeight,
  fontSizeOptions,
  fontFamilyOptions,
  letterSpacingOptions,
  lineHeightOptions,
}: {
  editor: Editor;
  activeHeading: string;
  setActiveHeading: (v: string) => void;
  activeFontSize: string;
  setActiveFontSize: (v: string) => void;
  activeFontFamily: string;
  setActiveFontFamily: (v: string) => void;
  activeLetterSpacing: string;
  setActiveLetterSpacing: (v: string) => void;
  activeLineHeight: string;
  setActiveLineHeight: (v: string) => void;
  fontSizeOptions: string[];
  fontFamilyOptions: { label: string; value: string }[];
  letterSpacingOptions: string[];
  lineHeightOptions: string[];
}) {
  return (
    <Group>
      <Select
        value={activeHeading}
        onValueChange={(value) => {
          if (value === 'paragraph') {
            editor.chain().focus().setParagraph().run();
          } else {
            const level = parseInt(value.replace('h', '')) as 1 | 2 | 3 | 4 | 5 | 6;
            editor.chain().focus().toggleHeading({ level }).run();
          }
          setActiveHeading(value);
        }}
      >
        <SelectTrigger className="h-8 w-[120px] text-sm bg-background">
          <SelectValue placeholder="Style" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="paragraph">Paragraph</SelectItem>
          <SelectItem value="h1">Heading 1</SelectItem>
          <SelectItem value="h2">Heading 2</SelectItem>
          <SelectItem value="h3">Heading 3</SelectItem>
          <SelectItem value="h4">Heading 4</SelectItem>
          <SelectItem value="h5">Heading 5</SelectItem>
          <SelectItem value="h6">Heading 6</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={activeFontSize}
        onValueChange={(value) => {
          editor.chain().focus().setFontSize(value).run();
          setActiveFontSize(value);
        }}
      >
        <SelectTrigger className="h-8 w-[80px] text-sm bg-background">
          <SelectValue placeholder="Size" />
        </SelectTrigger>
        <SelectContent>
          {fontSizeOptions.map((size) => (
            <SelectItem key={size} value={size}>{size.replace('px', '')}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={activeFontFamily}
        onValueChange={(value) => {
          (editor.chain() as any).focus().setFontFamily(value).run();
          setActiveFontFamily(value);
        }}
      >
        <SelectTrigger className="h-8 w-[170px] text-sm bg-background">
          <SelectValue placeholder="Font" />
        </SelectTrigger>
        <SelectContent className="max-h-72">
          {fontFamilyOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={activeLetterSpacing}
        onValueChange={(value) => {
          (editor.chain() as any).focus().setLetterSpacing(value).run();
          setActiveLetterSpacing(value);
        }}
      >
        <SelectTrigger className="h-8 w-[110px] text-sm bg-background">
          <SelectValue placeholder="Letter" />
        </SelectTrigger>
        <SelectContent>
          {letterSpacingOptions.map(v => (
            <SelectItem key={v} value={v}>{v}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={activeLineHeight}
        onValueChange={(value) => {
          (editor.chain() as any).focus().setLineHeight(value).run();
          setActiveLineHeight(value);
        }}
      >
        <SelectTrigger className="h-8 w-[110px] text-sm bg-background">
          <SelectValue placeholder="Line" />
        </SelectTrigger>
        <SelectContent>
          {lineHeightOptions.map(v => (
            <SelectItem key={v} value={v}>{v}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Group>
  );
}


