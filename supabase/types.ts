export type Article = {
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
