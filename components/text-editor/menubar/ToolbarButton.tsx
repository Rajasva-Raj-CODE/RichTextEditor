"use client";

import { memo } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export const ToolbarButton = memo(function ToolbarButton({
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
}) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClick}
            disabled={disabled}
            className={`h-8 w-8 transition-colors ${
              isActive
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
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
});


