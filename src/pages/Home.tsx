import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Post } from '../lib/types'
import { CATEGORIES, categoryToSlug } from '../lib/types'
import ArticleCard from '../components/ArticleCard'

export default function Home() {
  const [featured, setFeatured] = useState<Post[]>([])
  const [latest, setLatest] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const [{ data: feat }, { data: lat }] = await Promise.all([
        supabase.from('posts').select('*').eq('featured', true).order('created_at', { ascending: false }).limit(3),
        supabase.from('posts').select('*').order('created_at', { ascending: false }).limit(8),
      ])
      setFeatured(feat ?? [])
      setLatest(lat ?? [])
      setLoading(false)
    })()
  }, [])

  const hero = featured[0] ?? latest[0]
  const rest = hero ? latest.filter((p) => p.slug !== hero.slug).slice(0, 6) : latest.slice(0, 6)

  return (
    <div>
      {loading ? (
        <div className="container-blog py-20 text-center text-ink-400">Carregando...</div>
      ) : (
        <>
          {hero && (
            <section className="container-blog pt-8">
              <Link to={`/artigo/${hero.slug}`} className="card group block overflow-hidden">
                <div className="grid md:grid-cols-2">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img src={hero.cover_image} alt={hero.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  </div>
                  <div className="flex flex-col justify-center p-6 md:p-10">
                    <div className="flex items-center gap-2">
                      <span className="chip">Em destaque</span>
                      <Link to={`/categoria/${categoryToSlug(hero.category)}`} onClick={(e) => e.stopPropagation()} className="chip">
                        {hero.category}
                      </Link>
                    </div>
                    <h1 className="mt-4 text-3xl font-bold text-ink-900 group-hover:text-brand-600 md:text-4xl">
                      {hero.title}
                    </h1>
                    <p className="mt-3 text-ink-500">{hero.excerpt}</p>
                    <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
                      Ler artigo
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </span>
                  </div>
                </div>
              </Link>
            </section>
          )}

          <section className="container-blog mt-12">
            <h2 className="text-2xl font-bold text-ink-900">Artigos em destaque</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.slice(1).map((p) => (
                <ArticleCard key={p.slug} post={p} />
              ))}
            </div>
          </section>

          <section className="container-blog mt-12">
            <h2 className="text-2xl font-bold text-ink-900">Mais recentes</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((p) => (
                <ArticleCard key={p.slug} post={p} />
              ))}
            </div>
          </section>

          <section className="container-blog mt-12">
            <h2 className="text-2xl font-bold text-ink-900">Explore por categoria</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  to={`/categoria/${categoryToSlug(cat)}`}
                  className="card flex items-center justify-center p-6 text-center text-lg font-semibold text-ink-700 hover:text-brand-600"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
