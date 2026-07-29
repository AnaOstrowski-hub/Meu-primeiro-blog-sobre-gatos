import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const value = email.trim()
    if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setStatus('error')
      setMessage('Por favor, informe um e-mail válido.')
      return
    }
    setStatus('loading')
    const { error } = await supabase.from('newsletter').insert({ email: value })
    if (error) {
      if (error.code === '23505') {
        setStatus('success')
        setMessage('Você já está inscrito. Obrigado!')
        setEmail('')
      } else {
        setStatus('error')
        setMessage('Não foi possível concluir o cadastro. Tente novamente.')
      }
      return
    }
    setStatus('success')
    setMessage('Inscrição confirmada! Obrigado por se juntar à comunidade.')
    setEmail('')
  }

  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          aria-label="E-mail para newsletter"
          className="w-full rounded-full border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-800 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn-primary shrink-0"
        >
          {status === 'loading' ? 'Enviando...' : 'Inscrever'}
        </button>
      </div>
      {message && (
        <p className={`mt-2 text-sm ${status === 'error' ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </form>
  )
}
