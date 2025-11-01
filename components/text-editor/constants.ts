import fontFamilyLib from 'font-family';

export function getSystemDefaultStack() {
  try {
    const sys = (fontFamilyLib as any)?.toString ? (fontFamilyLib as any).toString() : undefined;
    return sys && typeof sys === 'string' && sys.length > 0
      ? sys
      : 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif';
  } catch {
    return 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif';
  }
}

export const FONT_SIZE_OPTIONS = ["12px", "14px", "16px", "18px", "20px", "24px", "32px"];
export const LETTER_SPACING_OPTIONS = ["-0.5px","0","0.5px","1px","2px"];
export const LINE_HEIGHT_OPTIONS = ["1","1.25","1.5","1.75","2"];

export function getFontFamilyOptions(systemDefaultStack: string) {
  return [
    { label: 'System default', value: systemDefaultStack },
    { label: 'Inter', value: 'Inter, system-ui, sans-serif' },
    { label: 'Arial', value: 'Arial, sans-serif' },
    { label: 'Roboto', value: 'Roboto, system-ui, sans-serif' },
    { label: 'Georgia', value: 'Georgia, serif' },
    { label: 'Times New Roman', value: 'Times New Roman, Times, serif' },
    { label: 'Courier New', value: 'Courier New, Courier, monospace' },
    { label: 'Monaco', value: 'Monaco, monospace' },
  ];
}


