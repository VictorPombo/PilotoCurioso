import Link from 'next/link';
import { Globe, Mail } from 'lucide-react';

const FOOTER_LINKS = [
  { href: '/transparencia', label: 'Termos de Uso' },
  { href: '/transparencia/privacidade', label: 'Política de Privacidade' },
  { href: '/transparencia/remocao', label: 'Política de Remoção' },
];

const SOCIAL_LINKS = [
  { href: 'https://instagram.com/piloto__curioso', icon: Globe, label: 'Instagram' },
  { href: 'mailto:contato@pilotocurioso.com.br', icon: Mail, label: 'E-mail' },
];

export function Footer() {
  return (
    <footer className="w-full bg-surface-0 border-t border-white/5 py-14 lg:py-20 mt-auto">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="flex flex-col gap-5 lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 group">
              <img
                src="/logo-limpo.png"
                alt="Piloto Curioso"
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-md">
              Portal de curiosidades, bastidores e engenharia do Automobilismo.
              Conteúdo autoral por <strong className="text-zinc-400">Enzo de Souza</strong>.
            </p>
            <div className="flex items-center gap-3 mt-2">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-zinc-500 hover:text-brand-red hover:border-brand-red/30 hover:bg-brand-red/5 transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-4">
            <h4 className="font-accent font-bold uppercase text-zinc-300 tracking-widest text-sm mb-1">
              Institucional
            </h4>
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-zinc-500 hover:text-white transition"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contato"
              className="text-sm text-zinc-500 hover:text-white transition mt-2 flex items-center gap-2"
            >
              <Mail className="w-3.5 h-3.5 text-brand-red" />
              Fale Conosco
            </Link>
          </div>

          {/* Portal */}
          <div className="flex flex-col gap-4">
            <h4 className="font-accent font-bold uppercase text-zinc-300 tracking-widest text-sm mb-1">
              Portal
            </h4>
            <Link href="/#curiosidades" className="text-sm text-zinc-500 hover:text-white transition">
              Curiosidades
            </Link>
            <Link href="/anuncie" className="text-sm text-zinc-500 hover:text-white transition">
              Apareça no Portal
            </Link>
            <Link href="/sobre" className="text-sm text-zinc-500 hover:text-white transition">
              Sobre o Enzo
            </Link>
          </div>
        </div>

        <div className="w-full mt-16 pt-8 border-t border-white/5 flex flex-col items-center gap-6">
          <div className="w-full bg-surface-2 p-6 sm:p-8 rounded-xl border border-zinc-800/80">
            <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
              Piloto Curioso é um portal jornalístico independente de conteúdo autoral sobre
              Automobilismo. Matérias agregadas são links para conteúdos publicados por portais de
              terceiros, aos quais pertencem todos os direitos autorais e editoriais. Matérias
              marcadas como &quot;Parceria&quot; são conteúdo patrocinado conforme normas do CONAR.
            </p>
          </div>

          <div className="text-zinc-600 text-[11px] sm:text-xs uppercase tracking-widest font-mono">
            © {new Date().getFullYear()} Piloto Curioso. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
}
