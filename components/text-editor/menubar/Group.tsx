"use client";

import type React from 'react';

export function Group({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-0.5 rounded-md border border-border/70 bg-background/50 p-0.5 shadow-sm">
      {children}
    </div>
  );
}


