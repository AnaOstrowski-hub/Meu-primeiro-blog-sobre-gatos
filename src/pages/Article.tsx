import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Post } from '../lib/types'
import { categoryToSlug, formatDate } from '../lib/types'
import Markdown from '../components/Markdown'
import ShareButtons from '../components/ShareButtons'
import Comments from '../components/Comments'

export default function Article() {
  const { slug = '' } = useParams()
  const [post, setPost] = useState<Post | null>(null)
  const [related, setRelated] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setPost(null)
    ;(async () => {
      const { data } = await supabase.from('posts').select('*').eq('slug', slug).maybeSingle()
      setPost(data)
      setLoading(false)
      if (data) {
        // increment views (best-effort)
        await supabase.from('posts').update({ views: (data.views ?? 0) + 1 }).eq('id', data.id)
        // related: same category, exclude current
        const { data: rel } = await supabase
          .from('posts')
          .select('*')
          .eq('category', data.category)
          .neq('slug', data.slug)
          .order('created_at', { ascending: false })
          .limit(3)
        setRelated(rel ?? [])
      }
    })()
  }, [slug])

  if (loading) {
    return <div className="container-blog py-20 text-center text-ink-400">Carregando...</div>
  }
  if (!post) {
    return (
      <div className="container-blog py-20 text-center">
        <h1 className="text-2xl font-bold text-ink-900">Artigo não encontrado</h1>
        <Link to="/" className="mt-4 inline-block text-brand-600 hover:underline">Voltar para a página inicial</Link>
      </div>
    )
  }

  return (
    <article>
      <header className="border-b border-ink-100 bg-white">
        <div className="container-prose py-8">
          <nav className="flex items-center gap-2 text-sm text-ink-400" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-brand-600">Início</Link>
            <span>/</span>
            <Link to={`/categoria/${categoryToSlug(post.category)}`} className="hover:text-brand-600">{post.category}</Link>
          </nav>
          <div className="mt-4 flex items-center gap-2">
            <Link to={`/categoria/${categoryToSlug(post.category)}`} className="chip">{post.category}</Link>
            <span className="text-sm text-ink-400">{formatDate(post.created_at)}</span>
          </div>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-ink-900 md:text-4xl">{post.title}</h1>
          <p className="mt-3 text-lg text-ink-500">{post.excerpt}</p>
          <div className="mt-4 flex items-center gap-3 text-sm text-ink-500">
            <span>Por {post.author}</span>
            <span>•</span>
            <span>{post.views} visualizações</span>
          </div>
          {post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <Link key={t} to={`/buscar?q=${encodeURIComponent(t)}`} className="rounded-full bg-ink-100 px-3 py-1 text-xs font-medium text-ink-600 hover:bg-brand-50 hover:text-brand-700">
                  #{t}
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>

      <div className="container-prose py-8">
        <img src={post.cover_image} alt={post.title} className="mb-8 aspect-[16/9] w-full rounded-2xl object-cover" />
        <Markdown content={post.content} />

        <div className="mt-10 border-t border-ink-100 pt-6">
          <ShareButtons title={post.title} slug={post.slug} />
        </div>

        <Comments postId={post.id} />
      </div>

      {related.length > 0 && (
        <section className="container-blog mt-8 border-t border-ink-100 py-10">
          <h2 className="text-2xl font-bold text-ink-900">Artigos relacionados</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ArticleCardLite key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}
    </article>
  )
}

function ArticleCardLite({ post }: { post: Post }) {
  return (
    <Link to={`/artigo/${post.slug}`} className="card group block">
      <div className="aspect-[16/10] overflow-hidden">
        <img src={post.cover_image} alt={post.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="p-4">
        <span className="chip">{post.category}</span>
        <h3 className="mt-2 font-semibold text-ink-900 group-hover:text-brand-600">{post.title}</h3>
      </div>
    </Link>
  )
}
