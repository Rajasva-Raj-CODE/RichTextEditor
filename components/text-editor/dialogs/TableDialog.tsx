"use client";

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function TableDialog({
  open,
  rows,
  cols,
  setRows,
  setCols,
  onClose,
  onInsert,
}: {
  open: boolean;
  rows: number;
  cols: number;
  setRows: (v: number) => void;
  setCols: (v: number) => void;
  onClose: () => void;
  onInsert: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
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
              value={rows}
              onChange={(e) => setRows(parseInt(e.target.value) || 1)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="table-cols">Columns</Label>
            <Input
              id="table-cols"
              type="number"
              min="1"
              value={cols}
              onChange={(e) => setCols(parseInt(e.target.value) || 1)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onInsert} className="bg-orange-600 hover:bg-orange-700">Insert</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


