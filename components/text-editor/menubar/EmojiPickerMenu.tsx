"use client";

import dynamic from 'next/dynamic';
import { useState } from 'react';
import type { EmojiClickData } from 'emoji-picker-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const EmojiPicker = dynamic<any>(() => import('emoji-picker-react'), { ssr: false });

export function EmojiPickerMenu({
  onSelect,
}: {
  onSelect: (emoji: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Emoji">
          <span className="text-lg">😊</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-0 w-[340px] h-[380px] overflow-hidden">
        <EmojiPicker
          autoFocusSearch
          lazyLoadEmojis
          width="100%"
          height="380px"
          onEmojiClick={(emojiData: EmojiClickData) => {
            onSelect(emojiData.emoji);
            setOpen(false);
          }}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


