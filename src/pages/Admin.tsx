import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Post } from '../lib/types'
import { CATEGORIES, formatDate, slugify } from '../lib/types'

type Draft = {
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image: string
  category: string
  tags: string
  meta_description: string
  author: string
  featured: boolean
}

const EMPTY: Draft = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  cover_image: '',
  category: CATEGORIES[0],
  tags: '',
  meta_description: '',
  author: 'Equipe Blog dos Gatos',
  featured: false,
}

export default function Admin() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<Draft>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false })
    setPosts(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function startEdit(p: Post) {
    setEditingId(p.id)
    setDraft({
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      content: p.content,
      cover_image: p.cover_image,
      category: p.category,
      tags: p.tags.join(', '),
      meta_description: p.meta_description,
      author: p.author,
      featured: p.featured,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function resetForm() {
    setEditingId(null)
    setDraft(EMPTY)
    setError('')
  }

  function onTitleChange(value: string) {
    setDraft((d) => ({ ...d, title: value, slug: d.slug || slugify(value) }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!draft.title.trim() || !draft.excerpt.trim() || !draft.content.trim() || !draft.cover_image.trim()) {
      setError('Preencha título, resumo, conteúdo e imagem de capa.')
      return
    }
    setSaving(true)
    const payload = {
      title: draft.title.trim(),
      slug: draft.slug.trim() || slugify(draft.title),
      excerpt: draft.excerpt.trim(),
      content: draft.content.trim(),
      cover_image: draft.cover_image.trim(),
      category: draft.category,
      tags: draft.tags.split(',').map((t) => t.trim()).filter(Boolean),
      meta_description: draft.meta_description.trim() || draft.excerpt.trim(),
      author: draft.author.trim() || 'Equipe Blog dos Gatos',
      featured: draft.featured,
    }
    if (editingId) {
      const { error: err } = await supabase.from('posts').update(payload).eq('id', editingId)
      if (err) setError(err.message)
    } else {
      const { error: err } = await supabase.from('posts').insert(payload)
      if (err) setError(err.message)
    }
    setSaving(false)
    if (!error && !setError) {
      resetForm()
      load()
    } else {
      load()
    }
  }

  async function onDelete(id: string) {
    const { error: err } = await supabase.from('posts').delete().eq('id', id)
    setConfirmDelete(null)
    if (err) setError(err.message)
    load()
  }

  return (
    <div className="container-blog py-10">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Painel administrativo</p>
          <h1 className="mt-1 text-3xl font-bold text-ink-900">Gerenciar postagens</h1>
        </div>
        <Link to="/" className="btn-ghost">Ver o blog</Link>
      </header>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      <section className="mb-12 rounded-2xl border border-ink-100 bg-white p-6">
        <h2 className="text-xl font-bold text-ink-900">{editingId ? 'Editar postagem' : 'Nova postagem'}</h2>
        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Título">
              <input type="text" value={draft.title} onChange={(e) => onTitleChange(e.target.value)} required className={inputCls} />
            </Field>
            <Field label="Slug (URL)">
              <input type="text" value={draft.slug} onChange={(e) => setDraft((d) => ({ ...d, slug: e.target.value }))} className={inputCls} />
            </Field>
          </div>
          <Field label="Resumo">
            <input type="text" value={draft.excerpt} onChange={(e) => setDraft((d) => ({ ...d, excerpt: e.target.value }))} required className={inputCls} />
          </Field>
          <Field label="Imagem de capa (URL)">
            <input type="url" value={draft.cover_image} onChange={(e) => setDraft((d) => ({ ...d, cover_image: e.target.value }))} required placeholder="https://..." className={inputCls} />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Categoria">
              <select value={draft.category} onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))} className={inputCls}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Tags (separadas por vírgula)">
              <input type="text" value={draft.tags} onChange={(e) => setDraft((d) => ({ ...d, tags: e.target.value }))} className={inputCls} />
            </Field>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Autor">
              <input type="text" value={draft.author} onChange={(e) => setDraft((d) => ({ ...d, author: e.target.value }))} className={inputCls} />
            </Field>
            <Field label="Meta descrição (SEO)">
              <input type="text" value={draft.meta_description} onChange={(e) => setDraft((d) => ({ ...d, meta_description: e.target.value }))} maxLength={160} className={inputCls} />
            </Field>
          </div>
          <Field label="Conteúdo (Markdown)">
            <textarea value={draft.content} onChange={(e) => setDraft((d) => ({ ...d, content: e.target.value }))} required rows={10} className={`${inputCls} font-mono text-xs`} />
          </Field>
          <label className="flex items-center gap-2 text-sm text-ink-700">
            <input type="checkbox" checked={draft.featured} onChange={(e) => setDraft((d) => ({ ...d, featured: e.target.checked }))} className="h-4 w-4 rounded border-ink-300 text-brand-500 focus:ring-brand-400" />
            Destacar na página inicial
          </label>
          <div className="flex items-center gap-3">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Salvando...' : editingId ? 'Salvar alterações' : 'Publicar'}
            </button>
            {editingId && <button type="button" onClick={resetForm} className="btn-ghost">Cancelar</button>}
          </div>
        </form>
      </section>

      <section>
        <h2 className="text-xl font-bold text-ink-900">Postagens existentes ({posts.length})</h2>
        {loading ? (
          <div className="py-10 text-center text-ink-400">Carregando...</div>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-2xl border border-ink-100">
            <table className="w-full text-left text-sm">
              <thead className="bg-ink-50 text-ink-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Título</th>
                  <th className="px-4 py-3 font-medium">Categoria</th>
                  <th className="px-4 py-3 font-medium">Data</th>
                  <th className="px-4 py-3 font-medium">Destaque</th>
                  <th className="px-4 py-3 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100 bg-white">
                {posts.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3">
                      <Link to={`/artigo/${p.slug}`} className="font-medium text-ink-900 hover:text-brand-600">{p.title}</Link>
                    </td>
                    <td className="px-4 py-3 text-ink-600">{p.category}</td>
                    <td className="px-4 py-3 text-ink-500">{formatDate(p.created_at)}</td>
                    <td className="px-4 py-3">{p.featured ? <span className="chip">Sim</span> : <span className="text-ink-400">—</span>}</td>
                    <td className="px-4 py-3 text-right">
                      {confirmDelete === p.id ? (
                        <span className="inline-flex gap-2">
                          <button onClick={() => onDelete(p.id)} className="font-semibold text-red-600 hover:underline">Confirmar</button>
                          <button onClick={() => setConfirmDelete(null)} className="text-ink-500 hover:underline">Cancelar</button>
                        </span>
                      ) : (
                        <span className="inline-flex gap-3">
                          <button onClick={() => startEdit(p)} className="text-brand-600 hover:underline">Editar</button>
                          <button onClick={() => setConfirmDelete(p.id)} className="text-red-600 hover:underline">Excluir</button>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

const inputCls = 'w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-800 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink-700">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  )
}
