import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container-blog py-20 text-center">
      <p className="text-6xl font-bold text-brand-500">404</p>
      <h1 className="mt-4 text-2xl font-bold text-ink-900">Página não encontrada</h1>
      <p className="mt-2 text-ink-500">A página que você procura não existe ou foi movida.</p>
      <Link to="/" className="btn-primary mt-6">Voltar para a página inicial</Link>
    </div>
  )
}
