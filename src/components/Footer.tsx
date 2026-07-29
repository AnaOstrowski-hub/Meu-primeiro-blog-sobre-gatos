import { Link } from 'react-router-dom'
import { CATEGORIES, categoryToSlug } from '../lib/types'
import NewsletterForm from './NewsletterForm'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="mt-16 border-t border-ink-100 bg-white">
      <div className="container-blog py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <img src="/favicon.svg" alt="" className="h-8 w-8" />
              <span className="font-serif text-lg font-bold text-ink-900">
                Blog<span className="text-brand-500">dosGatos</span>
              </span>
            </div>
            <p className="mt-3 text-sm text-ink-500">
              Conteúdo confiável sobre cuidados, saúde, raças e curiosidades dos gatos — em português.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink-900">Categorias</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <Link to={`/categoria/${categoryToSlug(cat)}`} className="text-ink-500 hover:text-brand-600">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink-900">Links úteis</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/sobre" className="text-ink-500 hover:text-brand-600">Sobre nós</Link></li>
              <li><Link to="/contato" className="text-ink-500 hover:text-brand-600">Contato</Link></li>
              <li><Link to="/admin" className="text-ink-500 hover:text-brand-600">Painel administrativo</Link></li>
              <li><Link to="/privacidade" className="text-ink-500 hover:text-brand-600">Política de privacidade</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink-900">Newsletter</h3>
            <p className="mt-3 text-sm text-ink-500">Receba novidades sobre gatos no seu e-mail.</p>
            <div className="mt-3">
              <NewsletterForm />
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-ink-100 pt-6 text-sm text-ink-400 sm:flex-row">
          <p>© {year} Blog dos Gatos. Todos os direitos reservados.</p>
          <p>Feito com amor para os amantes de gatos.</p>
        </div>
      </div>
    </footer>
  )
}
