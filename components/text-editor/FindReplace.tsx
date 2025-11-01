"use client";

import { Editor } from "@tiptap/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

interface FindReplaceProps {
  editor: Editor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FindReplace({ editor, open, onOpenChange }: FindReplaceProps) {
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");

  const clearHighlights = () => {
    // Remove any existing highlight marks from find operations
    // We use editor commands to properly handle the content structure
    const html = editor.getHTML();
    if (!html.includes('data-find="1"')) return; // No highlights to clear
    
    // Remove mark tags while preserving content
    const cleaned = html
      .replace(/<mark[^>]*data-find="1"[^>]*>/gi, '')
      .replace(/<\/mark>/gi, '');
    
    if (cleaned !== html) {
      editor.commands.setContent(cleaned);
    }
  };

  const findMatches = () => {
    if (!find.trim()) return;
    clearHighlights();
    
    // Get plain text content from editor
    const text = editor.getText();
    const escaped = find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const testRegex = new RegExp(escaped, "i");
    
    if (!testRegex.test(text)) {
      // No matches found
      alert(`No matches found for "${find}"`);
      return;
    }
    
    // Get HTML and highlight matches
    // We need to match text in HTML but preserve structure
    const html = editor.getHTML();
    const regex = new RegExp(escaped, "gi");
    
    // Replace matches with highlighted version
    const highlighted = html.replace(regex, (match) => {
      return `<mark data-find="1" style="background-color: #ffff00;">${match}</mark>`;
    });
    
    if (highlighted !== html) {
      editor.commands.setContent(highlighted);
    }
  };

  const replaceAll = () => {
    if (!find.trim()) return;
    clearHighlights();
    
    const html = editor.getHTML();
    const escaped = find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "gi");
    
    // Test if any matches exist
    if (!regex.test(editor.getText())) {
      alert(`No matches found for "${find}"`);
      return;
    }
    
    const next = html.replace(regex, replace || "");
    editor.commands.setContent(next);
    
    // Show confirmation
    const matches = (html.match(regex) || []).length;
    alert(`Replaced ${matches} occurrence(s)`);
    
    setFind(""); // Clear after replace
    setReplace("");
  };

  // Clear highlights when dialog closes
  useEffect(() => {
    if (!open) {
      clearHighlights();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        clearHighlights();
      }
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Find & Replace</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="find">Find</Label>
            <Input id="find" value={find} onChange={(e) => setFind(e.target.value)} placeholder="Search term" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="replace">Replace</Label>
            <Input id="replace" value={replace} onChange={(e) => setReplace(e.target.value)} placeholder="Replace with" />
          </div>
        </div>
        <DialogFooter className="sm:justify-between">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => {
              clearHighlights();
              onOpenChange(false);
            }}>Close</Button>
            <Button variant="secondary" onClick={findMatches} disabled={!find}>
              Find
            </Button>
          </div>
          <Button onClick={replaceAll} disabled={!find}>Replace All</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


