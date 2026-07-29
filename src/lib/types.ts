export type Post = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image: string
  category: string
  tags: string[]
  meta_description: string
  author: string
  featured: boolean
  views: number
  created_at: string
  updated_at: string
}

export type Comment = {
  id: string
  post_id: string
  author_name: string
  content: string
  created_at: string
}

export type Newsletter = {
  id: string
  email: string
  created_at: string
}

export const CATEGORIES = [
  'Cuidados',
  'Alimentação',
  'Saúde',
  'Raças',
  'Comportamento',
  'Curiosidades',
  'Adoção',
] as const

export type Category = typeof CATEGORIES[number]

export const CATEGORY_SLUGS: Record<string, string> = {
  'Cuidados': 'cuidados',
  'Alimentação': 'alimentacao',
  'Saúde': 'saude',
  'Raças': 'racas',
  'Comportamento': 'comportamento',
  'Curiosidades': 'curiosidades',
  'Adoção': 'adocao',
}

export const SLUG_TO_CATEGORY: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_SLUGS).map(([cat, slug]) => [slug, cat])
)

export function categoryToSlug(cat: string): string {
  return CATEGORY_SLUGS[cat] ?? slugify(cat)
}

export function slugToCategory(slug: string): string {
  return SLUG_TO_CATEGORY[slug] ?? slug
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}
