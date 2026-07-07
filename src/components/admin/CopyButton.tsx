'use client';

import { useState, useCallback } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
}

export function CopyButton({ text, label, className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 text-xs font-medium transition-all duration-200 ${
        copied
          ? 'text-emerald-400'
          : 'text-zinc-500 hover:text-white'
      } ${className}`}
      title="Copiar para área de transferência"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5" />
          {label ? 'Copiado!' : ''}
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          {label || ''}
        </>
      )}
    </button>
  );
}
