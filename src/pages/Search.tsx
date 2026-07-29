import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Post } from '../lib/types'
import ArticleCard from '../components/ArticleCard'

export default function Search() {
  const [params] = useSearchParams()
  const q = params.get('q') ?? ''
  const [results, setResults] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    if (!q.trim()) {
      setResults([])
      setLoading(false)
      return
    }
    (async () => {
      const filter = q.trim()
      const { data } = await supabase
        .from('posts')
        .select('*')
        .or(`title.ilike.%${filter}%,excerpt.ilike.%${filter}%,content.ilike.%${filter}%`)
        .order('created_at', { ascending: false })
      setResults(data ?? [])
      setLoading(false)
    })()
  }, [q])

  return (
    <div className="container-blog py-8">
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Resultados da busca</p>
        <h1 className="mt-1 text-3xl font-bold text-ink-900 md:text-4xl">
          {q ? `"${q}"` : 'Busca'}
        </h1>
        <p className="mt-2 text-ink-500">{loading ? 'Buscando...' : `${results.length} resultado${results.length !== 1 ? 's' : ''} encontrado${results.length !== 1 ? 's' : ''}`}</p>
      </header>

      {loading ? (
        <div className="py-20 text-center text-ink-400">Carregando...</div>
      ) : results.length === 0 ? (
        <div className="py-20 text-center text-ink-400">
          Nenhum artigo encontrado para "{q}". Tente outro termo.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((p) => (
            <ArticleCard key={p.slug} post={p} />
          ))}
        </div>
      )}
    </div>
  )
}
