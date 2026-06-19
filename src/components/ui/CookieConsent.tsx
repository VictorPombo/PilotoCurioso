'use client';

import { useState, useEffect } from 'react';
import { Shield, X } from 'lucide-react';
import Link from 'next/link';

const COOKIE_KEY = 'pc_cookie_consent';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  function handleAccept() {
    localStorage.setItem(COOKIE_KEY, 'accepted');
    setVisible(false);
  }

  function handleReject() {
    localStorage.setItem(COOKIE_KEY, 'rejected');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 animate-slide-up">
      <div className="max-w-4xl mx-auto bg-surface-card/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl shadow-black/50">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-brand-red/10 flex items-center justify-center shrink-0 mt-0.5">
            <Shield className="w-5 h-5 text-brand-red" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-accent font-bold text-white text-sm mb-1">
              Privacidade e Cookies
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              O Piloto Curioso utiliza cookies e tecnologias semelhantes para melhorar sua
              experiência, personalizar conteúdo e analisar o tráfego do portal, conforme a{' '}
              <Link href="/transparencia/privacidade" className="text-brand-red hover:underline">
                Política de Privacidade
              </Link>{' '}
              e a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018). Ao clicar em
              &quot;Aceitar&quot;, você concorda com o uso de cookies. Você pode recusar
              cookies não essenciais clicando em &quot;Recusar&quot;.
            </p>

            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={handleAccept}
                className="px-5 py-2 rounded-lg bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Aceitar
              </button>
              <button
                onClick={handleReject}
                className="px-5 py-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-all"
              >
                Recusar
              </button>
              <Link
                href="/transparencia/privacidade"
                className="text-xs text-zinc-500 hover:text-brand-red transition-colors ml-auto hidden sm:block"
              >
                Saiba mais
              </Link>
            </div>
          </div>

          <button
            onClick={handleReject}
            className="p-1.5 text-zinc-600 hover:text-white transition shrink-0"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
