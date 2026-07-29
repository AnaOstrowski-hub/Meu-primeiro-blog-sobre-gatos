import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Category from './pages/Category'
import Article from './pages/Article'
import Search from './pages/Search'
import Contact from './pages/Contact'
import Privacy from './pages/Privacy'
import About from './pages/About'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categoria/:slug" element={<Category />} />
          <Route path="/artigo/:slug" element={<Article />} />
          <Route path="/buscar" element={<Search />} />
          <Route path="/contato" element={<Contact />} />
          <Route path="/privacidade" element={<Privacy />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
