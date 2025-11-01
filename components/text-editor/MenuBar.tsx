"use client";

import { Editor } from "@tiptap/react";
import type React from "react";
import {
  type LucideIcon,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  CheckSquare,
  Link as LinkIcon,
  Image,
  Table,
  Quote,
  Minus,
  Code,
  Undo,
  Redo,
  FileDown,
  FileUp,
  Trash2,
  Eye,
  Moon,
  Sun,
  Subscript,
  Superscript,
  RemoveFormatting,
  ZoomIn,
  ZoomOut,
  Palette,
  Highlighter,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FindReplace } from "./FindReplace";
import { Search } from "lucide-react";
import { EmojiPickerMenu } from "./menubar/EmojiPickerMenu";
import fontFamilyLib from "font-family";
import { memo,useMemo, useState, useEffect } from "react";
import { ToolbarButton } from "./menubar/ToolbarButton";
import { getSystemDefaultStack, FONT_SIZE_OPTIONS, LETTER_SPACING_OPTIONS, LINE_HEIGHT_OPTIONS, getFontFamilyOptions } from "./constants";
import { HeadingFontGroup } from "./menubar/HeadingFontGroup";
import { Group as ToolbarGroup } from "./menubar/Group";
import { TableControls } from "./menubar/TableControls";
import { FooterStats } from "./menubar/FooterStats";
import { LinkDialog } from "./dialogs/LinkDialog";
import { ImageDialog } from "./dialogs/ImageDialog";
import { TableDialog } from "./dialogs/TableDialog";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// --- Enhanced Component: ToolbarButton (Retaining all original props and logic) ---
// ToolbarButton now imported

// Group moved to menubar/Group

// --- New Component: ColorPickerButton (Better UI for Color Inputs) ---
const ColorPickerButton = ({
  icon: Icon,
  value,
  onChange,
  tooltip,
}: {
  icon: LucideIcon;
  value: string;
  onChange: (color: string) => void;
  tooltip: string;
}) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-8 w-8 overflow-hidden p-0"
            aria-label={tooltip}
          >
            {/* Display the icon above the hidden color input, colored by the value */}
            <Icon className="h-4 w-4 absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ color: value }} />
            <input
              type="color"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              title={tooltip}
            />
             {/* Small visual band at the bottom */}
            <div
              className="absolute bottom-0 left-0 h-[2px] w-full"
              style={{ backgroundColor: value }}
            ></div>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};


interface MenuBarProps {
  editor: Editor | null;
  onExportPDF: () => void;
  onExportWord: () => void;
  onImportWord: (file: File) => void;
  onToggleSourceView: () => void;
  onToggleTheme: () => void;
  isDarkMode: boolean;
  zoom?: number;
  onZoomChange?: (next: number) => void;
}

export const MenuBar = memo(function MenuBar({
  editor,
  onExportPDF,
  onExportWord,
  onImportWord,
  onToggleSourceView,
  onToggleTheme,
  isDarkMode,
  zoom,
  onZoomChange,
}: MenuBarProps) {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [tableDialogOpen, setTableDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [textColor, setTextColor] = useState("#000000");
  const [highlightColor, setHighlightColor] = useState("#ffff00");
  const [activeHeading, setActiveHeading] = useState("paragraph");
  const [activeFontSize, setActiveFontSize] = useState("16px");
  const [activeFontFamily, setActiveFontFamily] = useState(() => {
    try {
      // Use library to compute a sensible system default stack if available
      const sys = (fontFamilyLib as any)?.toString
        ? (fontFamilyLib as any).toString()
        : undefined;
      return sys && typeof sys === 'string' && sys.length > 0 ? sys : "Inter, system-ui, sans-serif";
    } catch {
      return "Inter, system-ui, sans-serif";
    }
  });
  const [activeLetterSpacing, setActiveLetterSpacing] = useState("0");
  const [activeLineHeight, setActiveLineHeight] = useState("1.5");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [findOpen, setFindOpen] = useState(false);

  // Compute a system default stack for the font dropdown label/value
  const systemDefaultStack = useMemo(() => getSystemDefaultStack(), []);
  const fontSizeOptions = useMemo(() => FONT_SIZE_OPTIONS, []);
  const fontFamilyOptions = useMemo(() => getFontFamilyOptions(systemDefaultStack), [systemDefaultStack]);
  const letterSpacingOptions = useMemo(() => LETTER_SPACING_OPTIONS, []);
  const lineHeightOptions = useMemo(() => LINE_HEIGHT_OPTIONS, []);

  // Sync color values with editor state
  useEffect(() => {
    if (!editor) return;

    const updateColors = () => {
      const textStyleColor = editor.getAttributes("textStyle").color || "#000000";
      const highlightMark = editor.getAttributes("highlight");
      const currentHighlightColor = highlightMark.color || "#ffff00";

      setTextColor(textStyleColor);
      setHighlightColor(currentHighlightColor);
    };

    editor.on("selectionUpdate", updateColors);
    editor.on("transaction", updateColors);

    return () => {
      editor.off("selectionUpdate", updateColors);
      editor.off("transaction", updateColors);
    };
  }, [editor]);

  // Sync heading and font size
  useEffect(() => {
    if (!editor) return;

    const updateSelects = () => {
      const heading = editor.isActive("heading", { level: 1 })
        ? "h1"
        : editor.isActive("heading", { level: 2 })
        ? "h2"
        : editor.isActive("heading", { level: 3 })
        ? "h3"
        : editor.isActive("heading", { level: 4 })
        ? "h4"
        : editor.isActive("heading", { level: 5 })
        ? "h5"
        : editor.isActive("heading", { level: 6 })
        ? "h6"
        : "paragraph";

      const fontSize = editor.getAttributes("textStyle").fontSize || "16px";
      const fontFamily = editor.getAttributes("textStyle").fontFamily || "Inter, system-ui, sans-serif";
      const letterSpacing = editor.getAttributes("textStyle").letterSpacing || "0";
      const lineHeight = editor.getAttributes("textStyle").lineHeight || "1.5";

      setActiveHeading(heading);
      setActiveFontSize(fontSize);
      setActiveFontFamily(fontFamily);
      setActiveLetterSpacing(letterSpacing);
      setActiveLineHeight(lineHeight);
    };

    updateSelects();
    editor.on("selectionUpdate", updateSelects);
    editor.on("transaction", updateSelects);

    return () => {
      editor.off("selectionUpdate", updateSelects);
      editor.off("transaction", updateSelects);
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  const handleSetLink = () => {
    if (linkUrl) {
      const selection = editor.state.selection;
      const hasSelection = !selection.empty;
      // Original logic restored: insert text as link if no selection
      if (hasSelection) {
        editor.chain().focus().setLink({ href: linkUrl }).run();
      } else {
        editor
          .chain()
          .focus()
          .insertContent({
            type: "text",
            text: linkUrl,
            marks: [{ type: "link", attrs: { href: linkUrl } }],
          })
          .run();
      }
    } else {
      // Original logic restored: Remove link if URL is empty
      editor.chain().focus().unsetLink().run();
    }
    setLinkDialogOpen(false);
    setLinkUrl("");
  };

  const handleLinkClick = () => {
    const existingLink = editor.getAttributes("link");
    if (existingLink.href) {
      setLinkUrl(existingLink.href);
    } else {
      setLinkUrl(""); // Ensure it's clear if inserting new link
    }
    setLinkDialogOpen(true);
  };

  const handleInsertImage = () => {
    if (imageUrl) {
      // Original logic for basic URL validation
      try {
        new URL(imageUrl);
        editor.chain().focus().setImage({ src: imageUrl }).run();
      } catch {
        alert("Please enter a valid image URL.");
        return;
      }
    }
    setImageDialogOpen(false);
    setImageUrl("");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Original validation logic
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert("Image size must be less than 10MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        editor.chain().focus().setImage({ src: url }).run();
      };
      reader.onerror = () => {
        alert("Error reading image file.");
      };
      reader.readAsDataURL(file);
    }
    setImageDialogOpen(false);
  };

  const handleInsertTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: tableRows, cols: tableCols, withHeaderRow: true })
      .run();
    setTableDialogOpen(false);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = String(event.target?.result || "");
          const html = `<p>${text
            .split('\n')
            .map((line) => line.length ? line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : '<br/>')
            .join('</p><p>')}</p>`;
          editor.chain().focus().setContent(html).run();
        };
        reader.readAsText(file);
      } else {
        onImportWord(file);
      }
    }
  };
  
  const handleTextColorChange = (color: string) => {
    setTextColor(color);
    editor.chain().focus().setColor(color).run();
  };

  const handleHighlightColorChange = (color: string) => {
    setHighlightColor(color);
    if (editor.isActive("highlight")) {
      editor.chain().focus().setHighlight({ color }).run();
    } else {
      editor.chain().focus().toggleHighlight({ color }).run();
    }
  };


  return (
    // UI/UX Enhancement: Sticky header with shadow for better visual hierarchy
    <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 shadow-lg">
      <div className="mx-auto max-w-5xl px-3">
        {/* UI/UX Enhancement: Added overflow-x-auto for responsiveness */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto py-2">
          <div className="flex flex-wrap items-center gap-2">
            
            {/* File Actions Group */}
            <ToolbarGroup>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  {/* UI/UX Enhancement: Use a friendly color for Export */}
                  <Button variant="outline" size="sm" className="h-8 min-w-[90px] text-sm text-indigo-600 hover:text-indigo-700 border-indigo-300">
                    <FileDown className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={onExportPDF}>
                    Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onExportWord}>
                    Export as Word
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      const blob = new Blob([editor.getHTML()], {
                        type: 'text/html;charset=utf-8',
                      });
                      const a = document.createElement('a');
                      a.href = URL.createObjectURL(blob);
                      a.download = 'document.html';
                      a.click();
                      URL.revokeObjectURL(a.href);
                    }}
                  >
                    Export as HTML
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <label htmlFor="import-file">
                {/* UI/UX Enhancement: Use a friendly color for Import */}
                <Button variant="outline" size="sm" className="h-8 min-w-[90px] text-sm text-green-600 hover:text-green-700 border-green-300" asChild>
                  <span>
                    <FileUp className="h-4 w-4 mr-2" />
                    Import
                  </span>
                </Button>
              </label>
              <input
                id="import-file"
                type="file"
                accept=".docx,.html,.txt"
                className="hidden"
                onChange={handleImport}
              />
            </ToolbarGroup>
            
            {/* Undo/Redo Group */}
            <ToolbarGroup>
              <ToolbarButton
                icon={Undo}
                onClick={() => editor.chain().focus().undo().run()}
                tooltip="Undo"
                disabled={!editor.can().undo()}
              />
              <ToolbarButton
                icon={Redo}
                onClick={() => editor.chain().focus().redo().run()}
                tooltip="Redo"
                disabled={!editor.can().redo()}
              />
            </ToolbarGroup>

            {/* Style/Size Group */}
            <HeadingFontGroup
              editor={editor}
              activeHeading={activeHeading}
              setActiveHeading={setActiveHeading}
              activeFontSize={activeFontSize}
              setActiveFontSize={setActiveFontSize}
              activeFontFamily={activeFontFamily}
              setActiveFontFamily={setActiveFontFamily}
              activeLetterSpacing={activeLetterSpacing}
              setActiveLetterSpacing={setActiveLetterSpacing}
              activeLineHeight={activeLineHeight}
              setActiveLineHeight={setActiveLineHeight}
              fontSizeOptions={fontSizeOptions}
              fontFamilyOptions={fontFamilyOptions}
              letterSpacingOptions={letterSpacingOptions}
              lineHeightOptions={lineHeightOptions}
            />

            {/* Basic Formatting Group */}
            <ToolbarGroup>
              <ToolbarButton
                icon={Bold}
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive("bold")}
                tooltip="Bold"
              />
              <ToolbarButton
                icon={Italic}
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive("italic")}
                tooltip="Italic"
              />
              <ToolbarButton
                icon={Underline}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                isActive={editor.isActive("underline")}
                tooltip="Underline"
              />
              <ToolbarButton
                icon={Strikethrough}
                onClick={() => editor.chain().focus().toggleStrike().run()}
                isActive={editor.isActive("strike")}
                tooltip="Strikethrough"
              />
            </ToolbarGroup>

            {/* Subscript, Superscript, Color & Clear Formatting Group */}
            <ToolbarGroup>
              <ToolbarButton
                icon={Subscript}
                onClick={() => editor.chain().focus().toggleSubscript().run()}
                isActive={editor.isActive("subscript")}
                tooltip="Subscript"
              />
              <ToolbarButton
                icon={Superscript}
                onClick={() => editor.chain().focus().toggleSuperscript().run()}
                isActive={editor.isActive("superscript")}
                tooltip="Superscript"
              />
              {/* Replaced original color inputs with new ColorPickerButton for better UI */}
              <ColorPickerButton
                icon={Palette}
                value={textColor}
                onChange={handleTextColorChange}
                tooltip="Text Color"
              />
              <ColorPickerButton
                icon={Highlighter}
                value={highlightColor}
                onChange={handleHighlightColorChange}
                tooltip="Highlight/Background Color"
              />
              
              <ToolbarButton
                icon={RemoveFormatting}
                onClick={() =>
                  editor.chain().focus().clearNodes().unsetAllMarks().run()
                }
                tooltip="Clear Formatting"
              />
            </ToolbarGroup>

            {/* Alignment Group */}
            <ToolbarGroup>
              <ToolbarButton
                icon={AlignLeft}
                onClick={() =>
                  editor.chain().focus().setTextAlign("left").run()
                }
                isActive={editor.isActive({ textAlign: "left" })}
                tooltip="Align Left"
              />
              <ToolbarButton
                icon={AlignCenter}
                onClick={() =>
                  editor.chain().focus().setTextAlign("center").run()
                }
                isActive={editor.isActive({ textAlign: "center" })}
                tooltip="Align Center"
              />
              <ToolbarButton
                icon={AlignRight}
                onClick={() =>
                  editor.chain().focus().setTextAlign("right").run()
                }
                isActive={editor.isActive({ textAlign: "right" })}
                tooltip="Align Right"
              />
              <ToolbarButton
                icon={AlignJustify}
                onClick={() =>
                  editor.chain().focus().setTextAlign("justify").run()
                }
                isActive={editor.isActive({ textAlign: "justify" })}
                tooltip="Justify"
              />
            </ToolbarGroup>

            {/* List and Block Group */}
            <ToolbarGroup>
              <ToolbarButton
                icon={List}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive("bulletList")}
                tooltip="Bullet List"
              />
              <ToolbarButton
                icon={ListOrdered}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive("orderedList")}
                tooltip="Numbered List"
              />
              <ToolbarButton
                icon={CheckSquare}
                onClick={() => editor.chain().focus().toggleTaskList().run()}
                isActive={editor.isActive('taskList')}
                tooltip="Task List"
              />
              <ToolbarButton
                icon={Quote}
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                isActive={editor.isActive("blockquote")}
                tooltip="Blockquote"
              />
              <ToolbarButton
                icon={Minus}
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                tooltip="Horizontal Line"
              />
              <ToolbarButton
                icon={Code}
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                isActive={editor.isActive("codeBlock")}
                tooltip="Code Block"
              />
              <ToolbarButton
                icon={ChevronRight}
                onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
                tooltip="Indent"
              />
              <ToolbarButton
                icon={ChevronLeft}
                onClick={() => editor.chain().focus().liftListItem('listItem').run()}
                tooltip="Outdent"
              />
            </ToolbarGroup>

            {/* Insert Media Group */}
            <ToolbarGroup>
              <ToolbarButton
                icon={Search}
                onClick={() => setFindOpen(true)}
                tooltip="Find & Replace"
              />
              <ToolbarButton
                icon={LinkIcon}
                onClick={handleLinkClick}
                isActive={editor.isActive("link")}
                tooltip="Insert/Edit Link"
              />
              <ToolbarButton
                icon={Image}
                onClick={() => setImageDialogOpen(true)}
                tooltip="Insert Image"
              />
              <ToolbarButton
                icon={Table}
                onClick={() => setTableDialogOpen(true)}
                tooltip="Insert Table"
              />
              {/* Emoji Picker */}
              <EmojiPickerMenu onSelect={(emoji) => editor.chain().focus().insertContent(emoji).run()} />
            </ToolbarGroup>
          </div>

          {/* Right Side Utilities */}
          <div className="ml-auto flex items-center gap-2 flex-shrink-0">
            {onZoomChange ? (
              <ToolbarGroup>
                <ToolbarButton
                  icon={ZoomOut}
                  onClick={() =>
                    onZoomChange(
                      Math.max(0.5, Math.round(((zoom || 1) - 0.1) * 10) / 10)
                    )
                  }
                  tooltip="Zoom Out"
                />
                <div className="px-2 text-xs tabular-nums text-foreground/80 w-[50px] text-center font-medium">
                  {Math.round((zoom || 1) * 100)}%
                </div>
                <ToolbarButton
                  icon={ZoomIn}
                  onClick={() =>
                    onZoomChange(
                      Math.min(2, Math.round(((zoom || 1) + 0.1) * 10) / 10)
                    )
                  }
                  tooltip="Zoom In"
                />
              </ToolbarGroup>
            ) : null}

            <ToolbarGroup>
              <ToolbarButton
                icon={Eye}
                onClick={onToggleSourceView}
                tooltip="Source View"
              />
              <ToolbarButton
                icon={isDarkMode ? Sun : Moon}
                onClick={onToggleTheme}
                tooltip={isDarkMode ? "Light Mode" : "Dark Mode"}
              />
              {/* Case transform */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">Aa</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => {
                    const { from, to } = editor.state.selection;
                    const text = editor.state.doc.textBetween(from, to, '\n');
                    if (!text) return;
                    editor.chain().focus().insertContentAt({ from, to }, text.toUpperCase()).run();
                  }}>UPPERCASE</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    const { from, to } = editor.state.selection;
                    const text = editor.state.doc.textBetween(from, to, '\n');
                    if (!text) return;
                    editor.chain().focus().insertContentAt({ from, to }, text.toLowerCase()).run();
                  }}>lowercase</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    const { from, to } = editor.state.selection;
                    const text = editor.state.doc.textBetween(from, to, '\n');
                    if (!text) return;
                    const cap = text.replace(/\b(\p{L})(\p{L}*)/gu, (_, a, b) => a.toUpperCase() + String(b).toLowerCase());
                    editor.chain().focus().insertContentAt({ from, to }, cap).run();
                  }}>Capitalize Each Word</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* UI/UX Enhancement: Highlight destructive action in red */}
              <Button
                variant="default"
                className="bg-red-500 hover:bg-red-600 text-white h-8 ml-1"
                size="sm"
                onClick={() => {
                  if (confirm("Clear all content?")) {
                    editor.chain().focus().clearContent().run();
                  }
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </ToolbarGroup>
          </div>
        </div>
      </div>

      <TableControls editor={editor} />

      <FooterStats editor={editor} />

      {/* Dialogs (Original functionality, enhanced button colors) */}
      <FindReplace editor={editor} open={findOpen} onOpenChange={setFindOpen} />
      <LinkDialog
        open={linkDialogOpen}
        url={linkUrl}
        setUrl={setLinkUrl}
        onClose={() => { setLinkDialogOpen(false); setLinkUrl(""); }}
        onSubmit={handleSetLink}
        isEditing={editor.isActive("link")}
      />
      <ImageDialog
        open={imageDialogOpen}
        url={imageUrl}
        setUrl={setImageUrl}
        onClose={() => { setImageDialogOpen(false); setImageUrl(""); }}
        onUpload={(file) => handleImageUpload({ target: { files: [file] } } as any)}
        onInsert={handleInsertImage}
      />
      <TableDialog
        open={tableDialogOpen}
        rows={tableRows}
        cols={tableCols}
        setRows={(v) => setTableRows(v)}
        setCols={(v) => setTableCols(v)}
        onClose={() => setTableDialogOpen(false)}
        onInsert={handleInsertTable}
      />
    </div>
  );
});