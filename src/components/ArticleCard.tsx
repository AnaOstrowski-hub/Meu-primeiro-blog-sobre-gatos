import { Link } from 'react-router-dom'
import type { Post } from '../lib/types'
import { categoryToSlug, formatDate } from '../lib/types'

export default function ArticleCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  return (
    <article className={`card group fade-in ${featured ? 'md:col-span-2' : ''}`}>
      <Link to={`/artigo/${post.slug}`} className="block">
        <div className={`overflow-hidden ${featured ? 'aspect-[16/9]' : 'aspect-[16/10]'}`}>
          <img
            src={post.cover_image}
            alt={post.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2">
            <Link
              to={`/categoria/${categoryToSlug(post.category)}`}
              onClick={(e) => e.stopPropagation()}
              className="chip"
            >
              {post.category}
            </Link>
            <span className="text-xs text-ink-400">{formatDate(post.created_at)}</span>
          </div>
          <h3 className={`mt-3 font-bold text-ink-900 group-hover:text-brand-600 ${featured ? 'text-2xl' : 'text-lg'}`}>
            {post.title}
          </h3>
          <p className="mt-2 text-sm text-ink-500 line-clamp-2">{post.excerpt}</p>
        </div>
      </Link>
    </article>
  )
}
