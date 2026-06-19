'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  PenSquare,
  FolderOpen,
  Users,
  DollarSign,
  Sparkles,
  LogOut,
} from 'lucide-react';

const SIDEBAR_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/editor', label: 'Matérias', icon: PenSquare },
  { href: '/admin/categorias', label: 'Editorias', icon: FolderOpen },
  { href: '/admin/fontes', label: 'Fontes', icon: Users },
  { href: '/admin/receita', label: 'Receita', icon: DollarSign },
  { href: '/admin/ferramentas', label: 'Ferramentas IA', icon: Sparkles },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  }

  // Don't render sidebar on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-surface-0">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-surface-1 border-r border-white/5 p-4 shrink-0">
        <Link href="/admin" className="flex items-center gap-3 px-3 py-4 mb-6">
          <img src="/logo-limpo.png" alt="Piloto Curioso" className="w-8 h-8 rounded-lg object-cover" />
          <span className="font-display text-lg text-white tracking-wide">ADMIN</span>
        </Link>

        <nav className="flex flex-col gap-1 flex-1">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/admin' && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-red/10 text-brand-red'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/5 pt-4 mt-4">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-zinc-500 hover:text-white hover:bg-white/5 transition-all mb-1"
          >
            Ver portal →
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-zinc-500 hover:text-red-400 hover:bg-red-500/5 transition-all w-full"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-surface-1 border-b border-white/5">
          <Link href="/admin" className="flex items-center gap-2">
            <img src="/logo-limpo.png" alt="Piloto Curioso" className="w-7 h-7 rounded object-cover" />
            <span className="font-display text-sm text-white">ADMIN</span>
          </Link>
        </div>

        <div className="p-6 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
