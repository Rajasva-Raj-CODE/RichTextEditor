import { Extension } from '@tiptap/core';

interface CommandProps {
  chain: () => {
    setMark: (name: string, attrs: Record<string, unknown>) => {
      removeEmptyTextStyle?: () => { run: () => boolean };
      run: () => boolean;
    };
  };
}

export const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() {
    return { types: ['textStyle'] };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => (element as HTMLElement).style.fontSize || null,
            renderHTML: (attributes) => (attributes.fontSize ? { style: `font-size: ${attributes.fontSize}` } : {}),
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
        ({ chain }: CommandProps) => chain().setMark('textStyle', { fontSize }).run(),
      unsetFontSize:
        () =>
        ({ chain }: CommandProps) => {
          const result = chain().setMark('textStyle', { fontSize: null });
          return result.removeEmptyTextStyle ? result.removeEmptyTextStyle().run() : result.run();
        },
    } as Record<string, unknown>;
  },
});

export const FontFamily = Extension.create({
  name: 'fontFamily',
  addOptions() {
    return { types: ['textStyle'] };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontFamily: {
            default: null,
            parseHTML: (element) => (element as HTMLElement).style.fontFamily || null,
            renderHTML: (attrs) => (attrs.fontFamily ? { style: `font-family: ${attrs.fontFamily}` } : {}),
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontFamily:
        (fontFamily: string) =>
        ({ chain }: CommandProps) => chain().setMark('textStyle', { fontFamily }).run(),
    } as Record<string, unknown>;
  },
});

export const LetterSpacing = Extension.create({
  name: 'letterSpacing',
  addOptions() {
    return { types: ['textStyle'] };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          letterSpacing: {
            default: null,
            parseHTML: (element) => (element as HTMLElement).style.letterSpacing || null,
            renderHTML: (attrs) => (attrs.letterSpacing ? { style: `letter-spacing: ${attrs.letterSpacing}` } : {}),
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setLetterSpacing:
        (letterSpacing: string) =>
        ({ chain }: CommandProps) => chain().setMark('textStyle', { letterSpacing }).run(),
    } as Record<string, unknown>;
  },
});

export const LineHeight = Extension.create({
  name: 'lineHeight',
  addOptions() {
    return { types: ['textStyle'] };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: null,
            parseHTML: (element) => (element as HTMLElement).style.lineHeight || null,
            renderHTML: (attrs) => (attrs.lineHeight ? { style: `line-height: ${attrs.lineHeight}` } : {}),
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setLineHeight:
        (lineHeight: string) =>
        ({ chain }: CommandProps) => chain().setMark('textStyle', { lineHeight }).run(),
    } as Record<string, unknown>;
  },
});


