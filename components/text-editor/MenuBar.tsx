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
  // Added icons for clear color pickers in UI/UX enhancement
  Palette,
  Highlighter,
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// --- Enhanced Component: ToolbarButton (Retaining all original props and logic) ---
const ToolbarButton = ({
  icon: Icon,
  onClick,
  isActive = false,
  disabled = false,
  tooltip,
}: {
  icon: LucideIcon;
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  tooltip: string;
}) => (
  <TooltipProvider>
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <Button
          variant="ghost" // Use ghost for modern, cleaner look
          size="icon"
          onClick={onClick}
          disabled={disabled}
          className={`h-8 w-8 transition-colors ${
            // **UI/UX Enhancement: Use a distinct color for the active state**
            isActive
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          }`}
          aria-label={tooltip}
          aria-pressed={isActive}
        >
          <Icon className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

// --- Enhanced Component: Group (Improved visual separation) ---
const Group = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-0.5 rounded-md border border-border/70 bg-background/50 p-0.5 shadow-sm">
    {children}
  </div>
);

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

export function MenuBar({
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

      setActiveHeading(heading);
      setActiveFontSize(fontSize);
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
      onImportWord(file);
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
            <Group>
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
                accept=".docx,.html"
                className="hidden"
                onChange={handleImport}
              />
            </Group>
            
            {/* Undo/Redo Group */}
            <Group>
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
            </Group>

            {/* Style/Size Group */}
            <Group>
              <Select
                value={activeHeading}
                onValueChange={(value) => {
                  if (value === "paragraph") {
                    editor.chain().focus().setParagraph().run();
                  } else {
                    const level = parseInt(value.replace("h", "")) as
                      | 1
                      | 2
                      | 3
                      | 4
                      | 5
                      | 6;
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
                  {["12px", "14px", "16px", "18px", "20px", "24px", "32px"].map((size) => (
                      <SelectItem key={size} value={size}>
                          {size.replace('px', '')}
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Group>

            {/* Basic Formatting Group */}
            <Group>
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
            </Group>

            {/* Subscript, Superscript, Color & Clear Formatting Group */}
            <Group>
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
            </Group>

            {/* Alignment Group */}
            <Group>
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
            </Group>

            {/* List and Block Group */}
            <Group>
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
            </Group>

            {/* Insert Media Group */}
            <Group>
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
            </Group>
          </div>

          {/* Right Side Utilities */}
          <div className="ml-auto flex items-center gap-2 flex-shrink-0">
            {onZoomChange ? (
              <Group>
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
              </Group>
            ) : null}

            <Group>
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
            </Group>
          </div>
        </div>
      </div>

      {/* Table Controls (Original functionality, enhanced colors) */}
      {editor.isActive("table") && (
        <div className="flex flex-wrap items-center gap-1 p-2 border-t bg-muted/50 text-sm">
          <span className="font-semibold text-foreground/80 mr-2">Table:</span>
          <Group>
            <Button
              variant="secondary"
              size="sm"
              className="h-7 text-xs"
              onClick={() => editor.chain().focus().addRowBefore().run()}
            >
              Row Before
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="h-7 text-xs"
              onClick={() => editor.chain().focus().addRowAfter().run()}
            >
              Row After
            </Button>
            <Button
              variant="default"
              className="bg-red-500 hover:bg-red-600 text-white h-7 text-xs"
              size="sm"
              onClick={() => editor.chain().focus().deleteRow().run()}
            >
              Delete Row
            </Button>
          </Group>
          <Separator orientation="vertical" className="h-6 mx-1" />
          <Group>
            <Button
              variant="secondary"
              size="sm"
              className="h-7 text-xs"
              onClick={() => editor.chain().focus().addColumnBefore().run()}
            >
              Col Before
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="h-7 text-xs"
              onClick={() => editor.chain().focus().addColumnAfter().run()}
            >
              Col After
            </Button>
            <Button
              variant="default"
              className="bg-red-500 hover:bg-red-600 text-white h-7 text-xs"
              size="sm"
              onClick={() => editor.chain().focus().deleteColumn().run()}
            >
              Delete Col
            </Button>
          </Group>
          <Separator orientation="vertical" className="h-6 mx-1" />
          <Group>
            <Button
              variant="secondary"
              size="sm"
              className="h-7 text-xs"
              onClick={() => editor.chain().focus().mergeCells().run()}
            >
              Merge Cells
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="h-7 text-xs"
              onClick={() => editor.chain().focus().splitCell().run()}
            >
              Split Cell
            </Button>
            <Button
              variant="default"
              className="bg-red-700 hover:bg-red-800 text-white h-7 text-xs"
              size="sm"
              onClick={() => editor.chain().focus().deleteTable().run()}
            >
              Delete Table
            </Button>
          </Group>
        </div>
      )}

      {/* Dialogs (Original functionality, enhanced button colors) */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editor.isActive("link") ? "Edit Link" : "Insert Link"}
            </DialogTitle>
            <DialogDescription>Enter the URL for the link</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="link-url">URL</Label>
              <Input
                id="link-url"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSetLink();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setLinkDialogOpen(false);
                  setLinkUrl("");
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSetLink} className="bg-blue-500 hover:bg-blue-600">
                {editor.isActive("link") ? "Update" : "Insert"}
              </Button>
            </div>
            {editor.isActive("link") && (
              <Button
                variant="default"
                className="bg-red-500 hover:bg-red-600 text-white"
                onClick={() => {
                  editor.chain().focus().unsetLink().run();
                  setLinkDialogOpen(false);
                  setLinkUrl("");
                }}
              >
                Remove Link
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Image</DialogTitle>
            <DialogDescription>
              Upload an image or enter a URL
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="image-url">Image URL</Label>
              <Input
                id="image-url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or
                </span>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image-upload">Upload Image</Label>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                onClick={(e) => {
                  // Reset input value to allow selecting the same file again
                  (e.target as HTMLInputElement).value = "";
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setImageDialogOpen(false);
                setImageUrl("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleInsertImage} className="bg-purple-600 hover:bg-purple-700">
              Insert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={tableDialogOpen} onOpenChange={setTableDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Table</DialogTitle>
            <DialogDescription>Choose table dimensions</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="table-rows">Rows</Label>
              <Input
                id="table-rows"
                type="number"
                min="1"
                value={tableRows}
                onChange={(e) => setTableRows(parseInt(e.target.value) || 1)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="table-cols">Columns</Label>
              <Input
                id="table-cols"
                type="number"
                min="1"
                value={tableCols}
                onChange={(e) => setTableCols(parseInt(e.target.value) || 1)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTableDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInsertTable} className="bg-orange-600 hover:bg-orange-700">
              Insert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}