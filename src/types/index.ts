export interface Article {
  id: string;
  title: string;
  slug: string;
  brief: string | null;
  body: string | null;
  cover_image: string | null;
  cover_image_alt: string | null;
  category_id: string | null;
  is_sponsored: boolean;
  sponsor_name: string | null;
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  type: 'curiosidade' | 'noticia';
  scheduled_at: string | null;
  published_at: string | null;
  views: number;
  likes: number;
  seo_title: string | null;
  seo_description: string | null;
  og_image: string | null;
  tags: string[] | null;
  reading_time: number | null;
  ia_generated: boolean;
  created_at: string;
  updated_at: string;
  // Joined
  category?: Category;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string;
  icon: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name: string | null;
  is_active: boolean;
  subscribed_at: string;
}

export interface CuriosityIdea {
  id: string;
  title: string;
  description: string | null;
  category: string;
  is_used: boolean;
  article_id: string | null;
  performance_score: number | null;
  created_at: string;
}

export interface Source {
  id: string;
  name: string;
  role: string | null;
  organization: string | null;
  whatsapp: string | null;
  instagram: string | null;
  email: string | null;
  category: string | null;
  notes: string | null;
  last_contact: string | null;
  created_at: string;
}

export interface RevenueEntry {
  id: string;
  source: string;
  amount: number;
  type: 'patrocinio' | 'anuncio' | 'publi' | 'afiliado' | 'outro';
  description: string | null;
  article_id: string | null;
  date: string;
  created_at: string;
}

export interface AILog {
  id: string;
  tool: string;
  input: Record<string, unknown>;
  output: string;
  model: string;
  tokens_input: number;
  tokens_output: number;
  created_at: string;
}
