import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Política de Privacidade do portal Piloto Curioso conforme a LGPD (Lei nº 13.709/2018).',
};

export default function PrivacidadePage() {
  return (
    <main className="flex-1">
      <div className="max-w-3xl mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>

        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 rounded-xl bg-brand-red/10 flex items-center justify-center">
            <Shield className="w-6 h-6 text-brand-red" />
          </div>
          <div>
            <h1 className="font-display text-4xl text-white tracking-wide">POLÍTICA DE PRIVACIDADE</h1>
            <p className="text-zinc-500 text-sm mt-1">Última atualização: Junho de 2026</p>
          </div>
        </div>

        <div className="prose prose-invert prose-sm max-w-none space-y-8 text-zinc-300 leading-relaxed">
          <section>
            <h2 className="font-display text-xl text-white mb-3">1. INFORMAÇÕES GERAIS</h2>
            <p>
              O <strong className="text-white">Piloto Curioso</strong> (&quot;Portal&quot;) é um portal
              jornalístico independente sobre Fórmula 1, operado por Enzo de Souza. Esta Política de
              Privacidade descreve como coletamos, usamos, armazenamos e protegemos seus dados pessoais,
              em conformidade com a Lei Geral de Proteção de Dados Pessoais (LGPD — Lei nº 13.709/2018).
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-white mb-3">2. DADOS COLETADOS</h2>
            <p>Podemos coletar os seguintes dados:</p>
            <ul className="list-disc pl-6 space-y-1 text-zinc-400">
              <li><strong className="text-zinc-300">Dados de navegação:</strong> endereço IP, tipo de navegador, páginas acessadas, tempo de permanência e data/hora de acesso.</li>
              <li><strong className="text-zinc-300">Dados fornecidos voluntariamente:</strong> nome e e-mail, quando você se inscreve na newsletter ou entra em contato.</li>
              <li><strong className="text-zinc-300">Cookies:</strong> utilizamos cookies para análise de tráfego e personalização de conteúdo.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-white mb-3">3. FINALIDADE DO TRATAMENTO</h2>
            <p>Os dados são tratados para as seguintes finalidades:</p>
            <ul className="list-disc pl-6 space-y-1 text-zinc-400">
              <li>Envio de newsletters e conteúdo informativo (mediante consentimento)</li>
              <li>Análise de audiência e melhoria do conteúdo editorial</li>
              <li>Cumprimento de obrigações legais</li>
              <li>Personalização da experiência do usuário</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-white mb-3">4. BASE LEGAL</h2>
            <p>
              O tratamento de dados pessoais é realizado com base no <strong className="text-white">consentimento
              do titular</strong> (Art. 7º, I, LGPD) e no <strong className="text-white">legítimo interesse</strong> do
              controlador (Art. 7º, IX, LGPD) para fins de análise e melhoria do portal.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-white mb-3">5. COOKIES</h2>
            <p>O Portal utiliza os seguintes tipos de cookies:</p>
            <ul className="list-disc pl-6 space-y-1 text-zinc-400">
              <li><strong className="text-zinc-300">Essenciais:</strong> necessários para o funcionamento do site.</li>
              <li><strong className="text-zinc-300">Analíticos:</strong> utilizados para entender como os visitantes interagem com o portal (ex: Google Analytics).</li>
              <li><strong className="text-zinc-300">Funcionais:</strong> permitem lembrar preferências do usuário.</li>
            </ul>
            <p className="mt-3">
              Você pode gerenciar ou desativar cookies nas configurações do seu navegador. A desativação
              de cookies essenciais pode afetar o funcionamento do portal.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-white mb-3">6. COMPARTILHAMENTO DE DADOS</h2>
            <p>
              Seus dados pessoais <strong className="text-white">não são vendidos, alugados ou compartilhados</strong> com
              terceiros para fins comerciais. Podemos compartilhar dados apenas com:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-zinc-400">
              <li>Prestadores de serviço (hospedagem, e-mail marketing) sob obrigação de confidencialidade</li>
              <li>Autoridades competentes, quando exigido por lei</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-white mb-3">7. DIREITOS DO TITULAR</h2>
            <p>
              Conforme a LGPD, você tem direito a:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-zinc-400">
              <li>Confirmar a existência de tratamento de dados</li>
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir dados incompletos ou desatualizados</li>
              <li>Solicitar anonimização, bloqueio ou eliminação de dados</li>
              <li>Revogar o consentimento a qualquer momento</li>
              <li>Solicitar a portabilidade dos dados</li>
            </ul>
            <p className="mt-3">
              Para exercer seus direitos, entre em contato pelo e-mail:{' '}
              <a href="mailto:contato@pilotocurioso.com.br" className="text-brand-red hover:underline">
                contato@pilotocurioso.com.br
              </a>
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-white mb-3">8. SEGURANÇA DOS DADOS</h2>
            <p>
              Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados pessoais
              contra acesso não autorizado, perda, alteração ou destruição, incluindo criptografia,
              controle de acesso e monitoramento contínuo.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-white mb-3">9. RETENÇÃO DE DADOS</h2>
            <p>
              Os dados pessoais são armazenados pelo tempo necessário para cumprir as finalidades
              descritas nesta política, ou conforme exigido por lei. Dados de newsletter são mantidos
              até a solicitação de descadastro.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-white mb-3">10. CONTATO DO CONTROLADOR</h2>
            <div className="p-4 rounded-xl bg-surface-card border border-white/5">
              <p className="text-zinc-300">
                <strong className="text-white">Controlador:</strong> Enzo de Souza
              </p>
              <p className="text-zinc-300">
                <strong className="text-white">Portal:</strong> Piloto Curioso
              </p>
              <p className="text-zinc-300">
                <strong className="text-white">E-mail:</strong>{' '}
                <a href="mailto:contato@pilotocurioso.com.br" className="text-brand-red hover:underline">
                  contato@pilotocurioso.com.br
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
