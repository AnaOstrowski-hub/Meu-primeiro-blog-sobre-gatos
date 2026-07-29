import { Link } from 'react-router-dom'
import { CATEGORIES, categoryToSlug } from '../lib/types'
import SearchBar from './SearchBar'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/90 backdrop-blur">
      <div className="container-blog flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src="/favicon.svg" alt="" className="h-8 w-8" />
          <span className="font-serif text-xl font-bold text-ink-900">
            Blog<span className="text-brand-500">dosGatos</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1" aria-label="Categorias">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              to={`/categoria/${categoryToSlug(cat)}`}
              className="rounded-full px-3 py-2 text-sm font-medium text-ink-600 transition hover:bg-brand-50 hover:text-brand-700"
            >
              {cat}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block w-56">
          <SearchBar compact />
        </div>
      </div>

      <nav className="lg:hidden border-t border-ink-100 bg-white" aria-label="Categorias mobile">
        <div className="container-blog flex gap-1 overflow-x-auto py-2 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              to={`/categoria/${categoryToSlug(cat)}`}
              className="whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium text-ink-600 transition hover:bg-brand-50 hover:text-brand-700"
            >
              {cat}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}
