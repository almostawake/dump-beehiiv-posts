export interface BeehiivPost {
  id: string;
  publication_id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  thumbnail_url: string | null;
  content: string;
  web_content: string | null;
  premium_email_content?: string | null;
  status: 'draft' | 'confirmed' | 'archived';
  platform: 'web' | 'email' | 'both';
  free: boolean;
  created_at: string;
  updated_at: string;
  publish_date: string | null;
  feedback_enabled: boolean;
  audience: 'free' | 'premium' | 'all';
  featured: boolean;
  premium_tier_ids?: string[];
  authors: BeehiivAuthor[];
  content_tags?: string[];
  [key: string]: any;
}

export interface BeehiivAuthor {
  id: string;
  name: string;
  email: string;
  display_name?: string;
  [key: string]: any;
}

export interface BeehiivPostsResponse {
  data: BeehiivPost[];
  total: number;
  page: number;
  size: number;
  total_pages?: number;
}