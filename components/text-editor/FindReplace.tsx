"use client";

import { Editor } from "@tiptap/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface FindReplaceProps {
  editor: Editor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FindReplace({ editor, open, onOpenChange }: FindReplaceProps) {
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");

  const clearHighlights = () => {
    const html = editor.getHTML();
    const next = html.replace(/<mark data-find="1"[^>]*>|<\/mark>/gi, (m) => (m.startsWith("</") ? "" : ""));
    editor.commands.setContent(next);
  };

  const replaceAll = () => {
    if (!find) return;
    clearHighlights();
    const html = editor.getHTML();
    const escaped = find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "gi");
    const next = html.replace(regex, replace);
    editor.commands.setContent(next);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          </div>
          <Button onClick={replaceAll}>Replace All</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


