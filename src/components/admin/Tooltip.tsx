'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Info } from 'lucide-react';

interface TooltipProps {
  text: string;
  children?: React.ReactNode;
  showIcon?: boolean;
}

export function Tooltip({ text, children, showIcon = true }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<'top' | 'bottom'>('top');
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition(rect.top < 100 ? 'bottom' : 'top');
    }
  }, []);

  useEffect(() => {
    if (visible) updatePosition();
  }, [visible, updatePosition]);

  return (
    <span
      ref={triggerRef}
      className="relative inline-flex items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children || (
        showIcon && (
          <Info className="w-3.5 h-3.5 text-zinc-600 hover:text-zinc-400 transition-colors cursor-help" />
        )
      )}

      {visible && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 px-3 py-2 text-xs text-zinc-200 bg-zinc-900 border border-white/10 rounded-lg shadow-xl max-w-[220px] w-max pointer-events-none animate-fade-in ${
            position === 'top'
              ? 'bottom-full mb-2 left-1/2 -translate-x-1/2'
              : 'top-full mt-2 left-1/2 -translate-x-1/2'
          }`}
        >
          {text}
          <div
            className={`absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-900 border-white/10 rotate-45 ${
              position === 'top'
                ? 'bottom-[-5px] border-r border-b'
                : 'top-[-5px] border-l border-t'
            }`}
          />
        </div>
      )}
    </span>
  );
}
