-- ==========================================
-- PILOTO CURIOSO: SCHEMA DO BANCO DE DADOS
-- Supabase (Postgres) — Projeto NOVO e isolado
-- ==========================================

-- Editorias / Categorias (dinâmicas, criadas pelo admin)
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#E8002D',
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Matérias (core do portal)
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  brief TEXT,
  body TEXT,
  cover_image TEXT,
  cover_image_alt TEXT,
  category_id UUID REFERENCES public.categories(id),
  is_sponsored BOOLEAN DEFAULT FALSE,
  sponsor_name TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
  type TEXT DEFAULT 'noticia' CHECK (type IN ('noticia', 'curiosidade')),
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  og_image TEXT,
  tags TEXT[],
  reading_time INTEGER,
  ia_generated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Newsletter
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

-- Banco de Ideias (Biblioteca de Curiosidades)
CREATE TABLE IF NOT EXISTS public.curiosity_ideas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  article_id UUID REFERENCES public.articles(id),
  performance_score FLOAT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CRM de Fontes jornalísticas
CREATE TABLE IF NOT EXISTS public.sources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  organization TEXT,
  whatsapp TEXT,
  instagram TEXT,
  email TEXT,
  category TEXT,
  notes TEXT,
  last_contact TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mapa de Receita
CREATE TABLE IF NOT EXISTS public.revenue_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('patrocinio', 'anuncio', 'publi', 'afiliado', 'outro')),
  description TEXT,
  article_id UUID REFERENCES public.articles(id),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Logs de IA
CREATE TABLE IF NOT EXISTS public.ai_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tool TEXT NOT NULL,
  input JSONB,
  output TEXT,
  model TEXT,
  tokens_input INTEGER DEFAULT 0,
  tokens_output INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_type ON public.articles(type);
CREATE INDEX IF NOT EXISTS idx_articles_published ON public.articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category_id);
CREATE INDEX IF NOT EXISTS idx_curiosity_category ON public.curiosity_ideas(category);
CREATE INDEX IF NOT EXISTS idx_curiosity_used ON public.curiosity_ideas(is_used);
CREATE INDEX IF NOT EXISTS idx_revenue_type ON public.revenue_entries(type);
CREATE INDEX IF NOT EXISTS idx_revenue_date ON public.revenue_entries(date);

-- RLS: Leitura pública, escrita via service_role
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curiosity_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_logs ENABLE ROW LEVEL SECURITY;

-- Leitura pública de matérias publicadas e categorias
CREATE POLICY "public_read_articles" ON public.articles
  FOR SELECT USING (status = 'published');

CREATE POLICY "public_read_categories" ON public.categories
  FOR SELECT USING (is_active = TRUE);

-- Inserção pública na newsletter
CREATE POLICY "public_insert_newsletter" ON public.newsletter_subscribers
  FOR INSERT WITH CHECK (true);

-- Service role tem acesso total (via SUPABASE_SERVICE_ROLE_KEY)
-- Não precisa de policy — service role bypassa RLS

-- ==========================================
-- SEED: Editorias iniciais e Novas Categorias (Fase 2)
-- ==========================================
INSERT INTO public.categories (name, slug, description, color, icon, display_order) VALUES
  ('Você Sabia?', 'voce-sabia', 'Curiosidades rápidas sobre F1 que vão surpreender você', '#E8002D', '💡', 1),
  ('Bastidores da F1', 'bastidores', 'O que acontece por trás das câmeras no paddock', '#FF6B00', '🎬', 2),
  ('Engenharia Explicada', 'engenharia', 'Tecnologia da F1 explicada de forma simples', '#0066FF', '⚙️', 3),
  ('História da F1', 'historia', 'As histórias que moldaram o automobilismo', '#8B5CF6', '📜', 4),
  ('Pilotos e Equipes', 'pilotos-equipes', 'Perfis, análises e bastidores dos protagonistas', '#10B981', '🏎️', 5),
  ('Análise de Corrida', 'analise', 'Análise tática e estratégica das corridas', '#F59E0B', '📊', 6),
  ('Fórmula 1', 'f1', 'Notícias e acompanhamento diário da Fórmula 1', '#E8002D', '🏎️', 8),
  ('Fórmula 2', 'f2', 'O último degrau antes da elite do automobilismo', '#1D4ED8', '🏁', 9),
  ('Fórmula E', 'fe', 'O futuro eletrificado do esporte a motor', '#10B981', '⚡', 10),
  ('Automobilismo Brasileiro', 'br-automobilismo', 'A base e os talentos do Brasil nas pistas', '#FDE047', '🇧🇷', 11),
  ('Stock Car', 'stock-car', 'A principal categoria do automobilismo nacional', '#EF4444', '🚗', 12),
  ('Endurance', 'endurance', 'Resistência, Le Mans e WEC', '#8B5CF6', '⏱️', 13),
  ('Mercado de Pilotos', 'mercado', 'Rumores, transferências e contratos', '#F59E0B', '🔄', 14),
  ('Entrevistas', 'entrevistas', 'Conversas exclusivas com personagens do esporte', '#6B7280', '🎙️', 15)
ON CONFLICT (slug) DO NOTHING;
