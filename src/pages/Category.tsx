import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Post } from '../lib/types'
import { slugToCategory } from '../lib/types'
import ArticleCard from '../components/ArticleCard'

export default function Category() {
  const { slug = '' } = useParams()
  const category = slugToCategory(slug)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true);
    (async () => {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false })
      setPosts(data ?? [])
      setLoading(false)
    })()
  }, [category])

  return (
    <div className="container-blog py-8">
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Categoria</p>
        <h1 className="mt-1 text-3xl font-bold text-ink-900 md:text-4xl">{category}</h1>
        <p className="mt-2 text-ink-500">{posts.length} artigo{posts.length !== 1 ? 's' : ''} nesta categoria</p>
      </header>

      {loading ? (
        <div className="py-20 text-center text-ink-400">Carregando...</div>
      ) : posts.length === 0 ? (
        <div className="py-20 text-center text-ink-400">Nenhum artigo encontrado nesta categoria.</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <ArticleCard key={p.slug} post={p} />
          ))}
        </div>
      )}
    </div>
  )
}
