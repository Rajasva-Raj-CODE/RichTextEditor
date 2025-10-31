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
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={isActive ? "default" : "ghost"}
          size="icon"
          onClick={onClick}
          disabled={disabled}
          className="h-8 w-8"
          aria-label={tooltip}
          aria-pressed={isActive}
        >
          <Icon
            className={isActive ? "h-4 w-4" : "h-4 w-4 text-muted-foreground"}
          />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const Group = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-1 rounded-lg border border-border/50 bg-muted/30 px-1.5 py-1">
    {children}
  </div>
);

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

  // Sync color values with editor state
  useEffect(() => {
    if (!editor) return;

    const updateColors = () => {
      const textStyleColor = editor.getAttributes("textStyle").color;
      const highlightColor = editor.getAttributes("highlight").color;

      if (textStyleColor) {
        setTextColor(textStyleColor);
      }
      if (highlightColor) {
        setHighlightColor(highlightColor);
      }
    };

    editor.on("selectionUpdate", updateColors);
    editor.on("transaction", updateColors);

    return () => {
      editor.off("selectionUpdate", updateColors);
      editor.off("transaction", updateColors);
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  const handleSetLink = () => {
    if (linkUrl) {
      const selection = editor.state.selection;
      const hasSelection = !selection.empty;
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
      // Remove link if URL is empty
      editor.chain().focus().unsetLink().run();
    }
    setLinkDialogOpen(false);
    setLinkUrl("");
  };

  const handleLinkClick = () => {
    const existingLink = editor.getAttributes("link");
    if (existingLink.href) {
      setLinkUrl(existingLink.href);
    }
    setLinkDialogOpen(true);
  };

  const handleInsertImage = () => {
    if (imageUrl) {
      // Basic URL validation
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
      // Check file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file.");
        return;
      }
      // Check file size (max 10MB)
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

  return (
    <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 shadow-sm">
      <div className="mx-auto max-w-5xl px-3">
        <div className="flex items-center justify-between gap-2 overflow-x-auto py-2">
          <div className="flex flex-wrap items-center gap-2">
            <Group>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
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
                <Button variant="outline" size="sm" className="h-8" asChild>
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

            <Group>
              <Select
                value={
                  editor.isActive("heading", { level: 1 })
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
                    : "paragraph"
                }
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
                }}
              >
                <SelectTrigger className="h-8 w-[120px] text-sm">
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
                value={editor.getAttributes("textStyle").fontSize || "16px"}
                onValueChange={(value) => {
                  editor.chain().focus().setFontSize(value).run();
                }}
              >
                <SelectTrigger className="h-8 w-[80px] text-sm">
                  <SelectValue placeholder="Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12px">12</SelectItem>
                  <SelectItem value="14px">14</SelectItem>
                  <SelectItem value="16px">16</SelectItem>
                  <SelectItem value="18px">18</SelectItem>
                  <SelectItem value="20px">20</SelectItem>
                  <SelectItem value="24px">24</SelectItem>
                  <SelectItem value="32px">32</SelectItem>
                </SelectContent>
              </Select>
            </Group>

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
              <input
                type="color"
                onInput={(e) => {
                  const color = (e.target as HTMLInputElement).value;
                  setTextColor(color);
                  editor.chain().focus().setColor(color).run();
                }}
                value={textColor}
                className="h-8 w-8 rounded cursor-pointer border border-border"
                title="Text Color"
                aria-label="Text Color"
              />
              <input
                type="color"
                onInput={(e) => {
                  const color = (e.target as HTMLInputElement).value;
                  setHighlightColor(color);
                  if (editor.isActive("highlight")) {
                    editor.chain().focus().setHighlight({ color }).run();
                  } else {
                    editor.chain().focus().toggleHighlight({ color }).run();
                  }
                }}
                value={highlightColor}
                className="h-8 w-8 rounded cursor-pointer border border-border"
                title="Background Color"
                aria-label="Background Color"
              />
              <ToolbarButton
                icon={RemoveFormatting}
                onClick={() =>
                  editor.chain().focus().clearNodes().unsetAllMarks().run()
                }
                tooltip="Clear Formatting"
              />
            </Group>

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

          <div className="ml-auto flex items-center gap-2">
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
                <div className="px-2 text-xs tabular-nums text-muted-foreground w-[50px] text-center">
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
              <Button
                variant="outline"
                size="sm"
                className="h-8"
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

      {editor.isActive("table") && (
        <div className="flex items-center gap-1 p-2 border-t bg-muted/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().addRowBefore().run()}
          >
            Row Before
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().addRowAfter().run()}
          >
            Row After
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().deleteRow().run()}
          >
            Delete Row
          </Button>
          <Separator orientation="vertical" className="h-6 mx-1" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().addColumnBefore().run()}
          >
            Col Before
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().addColumnAfter().run()}
          >
            Col After
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().deleteColumn().run()}
          >
            Delete Col
          </Button>
          <Separator orientation="vertical" className="h-6 mx-1" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().mergeCells().run()}
          >
            Merge Cells
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().splitCell().run()}
          >
            Split Cell
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().deleteTable().run()}
          >
            Delete Table
          </Button>
        </div>
      )}

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
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setLinkDialogOpen(false);
                setLinkUrl("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSetLink}>
              {editor.isActive("link") ? "Update" : "Insert"}
            </Button>
            {editor.isActive("link") && (
              <Button
                variant="destructive"
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
            <Button onClick={handleInsertImage}>Insert</Button>
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
            <Button onClick={handleInsertTable}>Insert</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
