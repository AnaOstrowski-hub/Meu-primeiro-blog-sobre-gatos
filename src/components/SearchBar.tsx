import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SearchBar({ compact = false }: { compact?: boolean }) {
  const [q, setQ] = useState('')
  const navigate = useNavigate()

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const query = q.trim()
    if (!query) return
    navigate(`/buscar?q=${encodeURIComponent(query)}`)
    setQ('')
  }

  return (
    <form onSubmit={onSubmit} className="relative w-full" role="search">
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar artigos..."
        aria-label="Buscar artigos"
        className={`w-full rounded-full border border-ink-200 bg-ink-50 py-2 pl-10 pr-4 text-sm text-ink-800 placeholder:text-ink-400 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-200 ${
          compact ? 'max-w-xs' : ''
        }`}
      />
      <svg
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
      </svg>
    </form>
  )
}
