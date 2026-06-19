'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Search, Menu, X, Flag } from 'lucide-react';

const NAV_LINKS = [
  { href: '/', label: 'INÍCIO', active: true },
  { href: '/noticias', label: 'NOTÍCIAS' },
  { href: '/#curiosidades', label: 'CURIOSIDADES' },
  { href: '/temporada', label: 'TEMPORADA F1' },
  { href: '/#editorias', label: 'EDITORIAS' },
  { href: '/sobre', label: 'SOBRE' },
  { href: '/anuncie', label: 'APAREÇA NO PORTAL', accent: true },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-black/90 backdrop-blur-xl shadow-2xl shadow-black/50'
            : 'bg-black/60 backdrop-blur-md'
        } border-b border-white/[0.04] h-[70px] flex items-center`}
      >
        <div className="max-w-[1400px] w-full mx-auto px-4 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <img
              src="/logo-limpo.png"
              alt="Piloto Curioso"
              className="h-12 w-auto object-contain group-hover:scale-105 transition-transform shadow-lg shadow-brand-red/20 drop-shadow-xl"
            />
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-6 ml-10 h-full">
            {NAV_LINKS.map((link) => (
              <li key={link.href} className="h-full flex items-center relative">
                <Link
                  href={link.href}
                  className={`text-sm font-bold uppercase tracking-wider transition-all hover:text-white ${
                    link.active
                      ? 'text-brand-red'
                      : link.accent
                      ? 'text-brand-red hover:text-brand-red-dark'
                      : 'text-zinc-400'
                  }`}
                >
                  {link.label}
                </Link>
                {link.active && (
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-red shadow-[0_0_10px_rgba(232,0,45,0.8)]" />
                )}
              </li>
            ))}
          </ul>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#4a0009] border border-brand-red/30 text-white hover:bg-brand-red transition-all"
            >
              <span className="text-xs font-bold uppercase tracking-wider">Buscar</span>
              <Search className="w-4 h-4 text-brand-red" />
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-zinc-400 hover:text-white transition"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 pt-[70px] bg-black/95 backdrop-blur-xl lg:hidden">
          <ul className="flex flex-col p-6 gap-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-lg font-medium transition-all ${
                    link.accent
                      ? 'text-brand-red bg-brand-red/5'
                      : 'text-zinc-200 hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Search modal */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh] bg-black/80 backdrop-blur-sm"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-xl mx-4 bg-surface-2 rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
              <Search className="w-5 h-5 text-zinc-500" />
              <input
                autoFocus
                type="text"
                placeholder="Buscar matérias, curiosidades..."
                className="flex-1 bg-transparent text-white placeholder-zinc-500 text-lg outline-none"
              />
              <kbd className="text-xs text-zinc-600 bg-white/5 px-2 py-1 rounded">ESC</kbd>
            </div>
            <div className="p-5 text-center text-zinc-600 text-sm">
              Digite para buscar no portal
            </div>
          </div>
        </div>
      )}
    </>
  );
}
