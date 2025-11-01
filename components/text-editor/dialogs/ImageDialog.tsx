"use client";

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ImageDialog({
  open,
  url,
  setUrl,
  onClose,
  onUpload,
  onInsert,
}: {
  open: boolean;
  url: string;
  setUrl: (v: string) => void;
  onClose: () => void;
  onUpload: (file: File) => void;
  onInsert: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Insert Image</DialogTitle>
          <DialogDescription>Upload an image or enter a URL</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="image-url">Image URL</Label>
            <Input
              id="image-url"
              placeholder="https://example.com/image.jpg"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="image-upload">Upload Image</Label>
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) onUpload(file);
                (e.target as HTMLInputElement).value = '';
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onInsert} className="bg-purple-600 hover:bg-purple-700">Insert</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


