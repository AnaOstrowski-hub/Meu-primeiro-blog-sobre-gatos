import { useState } from 'react'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
    setName('')
    setEmail('')
    setMessage('')
  }

  return (
    <div className="container-prose py-10">
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Fale conosco</p>
        <h1 className="mt-1 text-3xl font-bold text-ink-900 md:text-4xl">Contato</h1>
        <p className="mt-3 text-ink-500">
          Tem alguma dúvida, sugestão de artigo ou quer compartilhar a história do seu gato? Escreva para a gente!
        </p>
      </header>

      {sent ? (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-green-700">
          Mensagem enviada com sucesso! Agradecemos o seu contato e responderemos em breve.
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-ink-700">Nome</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-ink-700">E-mail</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-ink-700">Mensagem</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={5}
              className="mt-1 w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </div>
          <button type="submit" className="btn-primary">Enviar mensagem</button>
        </form>
      )}
    </div>
  )
}
