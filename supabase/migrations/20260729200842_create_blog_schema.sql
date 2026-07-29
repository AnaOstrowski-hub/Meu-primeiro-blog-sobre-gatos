/*
# Blog dos Gatos — schema inicial

1. Novas tabelas
- `posts`: artigos do blog. Colunas: id, title, slug (único), excerpt, content (markdown/HTML),
  cover_image, category, tags (array), meta_description, author, featured (bool), views, created_at, updated_at.
- `comments`: comentários dos leitores em artigos. Colunas: id, post_id (FK), author_name, content, created_at.
- `newsletter`: cadastros de e-mail. Colunas: id, email (único), created_at.
2. Segurança (RLS)
- Habilita RLS em todas as tabelas.
- App sem login de leitor: políticas `TO anon, authenticated` para leitura pública dos posts e comments,
  inserção pública de comments e newsletter, e CRUD público em posts (painel admin simples sem auth).
- `USING (true)` é aceito porque o conteúdo é intencionalmente público (blog sem login).
3. Notas
- `slug` é único para URLs amigáveis.
- `tags` é um array de texto para categorização cruzada.
- `views` incrementa a cada visualização de artigo.
- Índices em slug, category, created_at e post_id para performance.
*/

CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  cover_image text NOT NULL,
  category text NOT NULL,
  tags text[] NOT NULL DEFAULT '{}',
  meta_description text NOT NULL,
  author text NOT NULL DEFAULT 'Equipe Blog dos Gatos',
  featured boolean NOT NULL DEFAULT false,
  views integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS newsletter (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_featured ON posts(featured);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter ENABLE ROW LEVEL SECURITY;

-- posts: leitura pública, CRUD público (admin simples sem auth)
DROP POLICY IF EXISTS "anon_select_posts" ON posts;
CREATE POLICY "anon_select_posts" ON posts FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_posts" ON posts;
CREATE POLICY "anon_insert_posts" ON posts FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_posts" ON posts;
CREATE POLICY "anon_update_posts" ON posts FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_posts" ON posts;
CREATE POLICY "anon_delete_posts" ON posts FOR DELETE
  TO anon, authenticated USING (true);

-- comments: leitura pública, inserção pública
DROP POLICY IF EXISTS "anon_select_comments" ON comments;
CREATE POLICY "anon_select_comments" ON comments FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_comments" ON comments;
CREATE POLICY "anon_insert_comments" ON comments FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_comments" ON comments;
CREATE POLICY "anon_delete_comments" ON comments FOR DELETE
  TO anon, authenticated USING (true);

-- newsletter: leitura e inserção públicas
DROP POLICY IF EXISTS "anon_select_newsletter" ON newsletter;
CREATE POLICY "anon_select_newsletter" ON newsletter FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_newsletter" ON newsletter;
CREATE POLICY "anon_insert_newsletter" ON newsletter FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_newsletter" ON newsletter;
CREATE POLICY "anon_delete_newsletter" ON newsletter FOR DELETE
  TO anon, authenticated USING (true);
