import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Comment } from '../lib/types'
import { formatDate } from '../lib/types'

export default function Comments({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: false })
      setComments(data ?? [])
    })()
  }, [postId])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const n = name.trim()
    const t = text.trim()
    if (!n || !t) {
      setStatus('error')
      setMessage('Preencha seu nome e o comentário.')
      return
    }
    setStatus('loading')
    const { data, error } = await supabase
      .from('comments')
      .insert({ post_id: postId, author_name: n, content: t })
      .select('*')
      .single()
    if (error || !data) {
      setStatus('error')
      setMessage('Não foi possível enviar o comentário. Tente novamente.')
      return
    }
    setComments((prev) => [data as Comment, ...prev])
    setName('')
    setText('')
    setStatus('success')
    setMessage('Comentário publicado. Obrigado!')
  }

  return (
    <section className="mt-12 border-t border-ink-100 pt-8" aria-label="Comentários">
      <h2 className="text-2xl font-bold text-ink-900">Comentários ({comments.length})</h2>

      <form onSubmit={onSubmit} className="mt-6 space-y-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Seu nome"
          aria-label="Seu nome"
          maxLength={60}
          className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-800 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escreva seu comentário..."
          aria-label="Comentário"
          rows={3}
          maxLength={500}
          className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-800 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
        />
        <div className="flex items-center gap-3">
          <button type="submit" disabled={status === 'loading'} className="btn-primary">
            {status === 'loading' ? 'Enviando...' : 'Enviar comentário'}
          </button>
          {message && (
            <span className={`text-sm ${status === 'error' ? 'text-red-600' : 'text-green-600'}`}>{message}</span>
          )}
        </div>
      </form>

      <div className="mt-8 space-y-4">
        {comments.length === 0 ? (
          <p className="text-ink-400">Seja o primeiro a comentar.</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="rounded-xl border border-ink-100 bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-ink-900">{c.author_name}</span>
                <span className="text-xs text-ink-400">{formatDate(c.created_at)}</span>
              </div>
              <p className="mt-2 text-sm text-ink-700">{c.content}</p>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
