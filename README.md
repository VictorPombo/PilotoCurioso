# 🏁 Driver News — Portal Grid Hub

## Setup para Desenvolvedores

### Pré-requisitos
- Node.js 18+ (recomendado: 20+)
- npm

### Primeiro Clone
```bash
git clone https://github.com/VictorPombo/PortalGridHub.git
cd PortalGridHub
npm install
cp .env.example .env.local
# Preencha as chaves no .env.local (peça ao admin do projeto)
npm run dev
```

### Após cada `git pull`
**SEMPRE execute estes comandos após puxar atualizações:**
```bash
git pull origin main
rm -rf .next          # Limpa cache de build antigo
npm install           # Atualiza dependências que podem ter mudado
npm run dev           # Sobe o servidor limpo
```

### Variáveis de Ambiente Obrigatórias
Veja `.env.example` para a lista completa. As mais críticas:

| Variável | Descrição |
|----------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave pública do Supabase |
| `GEMINI_API_KEY` | Chave da API Google Gemini (IA) |
| `ASAAS_API_KEY` | Chave do gateway de pagamento |

### Resolução de Problemas

**"Erro X que já foi corrigido aparece de novo"**
```bash
rm -rf .next node_modules/.cache
npm run dev
```

**"IA não gera textos / erro 404"**
- Verifique se `GEMINI_API_KEY` está no `.env.local`
- O modelo atual é `gemini-2.5-flash`

**"Acesso negado / Token não encontrado"**
- Faça login novamente no painel
- Verifique se `SUPABASE_SERVICE_ROLE_KEY` está configurada

### Git Config (Obrigatório para Deploy na Vercel)
O email do Git deve ser o mesmo verificado na Vercel:
```bash
git config user.email "victorpombo20@gmail.com"
git config user.name "Victor Pombo"
```
