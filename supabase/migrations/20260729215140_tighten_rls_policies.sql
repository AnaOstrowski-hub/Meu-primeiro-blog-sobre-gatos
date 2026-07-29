/*
# Restringir politicas RLS — remover acesso publico irrestrito a escrita

1. Contexto
O blog e publico para leitura (qualquer visitante le artigos e comentarios), mas a
escrita de posts, a moderacao/exclusao de comentarios e o acesso a lista de e-mails
da newsletter nao devem ser publicos. Apenas um administrador autenticado deve
poder realizar essas operacoes. O painel administrativo agora exige login
(e-mail/senha via Supabase Auth).

2. Mudancas por tabela

## posts
- SELECT: permanece publico (TO anon, authenticated) — leitura do blog e intencional.
- INSERT: agora exige autenticacao (TO authenticated). O admin cria postagens.
- UPDATE: agora exige autenticacao (TO authenticated). O admin edita postagens.
- DELETE: agora exige autenticacao (TO authenticated). O admin exclui postagens.

## comments
- SELECT: permanece publico (TO anon, authenticated) — comentarios sao exibidos no site.
- INSERT: permanece publico (TO anon, authenticated), mas agora valida que author_name
  e content nao estao vazios e respeitam limites de tamanho (WITH CHECK real).
- DELETE: agora exige autenticacao (TO authenticated) — moderacao pelo admin.

## newsletter
- SELECT: agora exige autenticacao (TO authenticated) — so o admin ve a lista de e-mails.
- INSERT: permanece publico (TO anon, authenticated), mas agora valida o formato do e-mail
  com regex (WITH CHECK real).
- DELETE: agora exige autenticacao (TO authenticated) — so o admin remove inscricoes.

3. Notas de seguranca
- Nenhuma coluna ou tabela foi alterada; apenas politicas RLS.
- O app sem login continua funcionando para leitura, comentario e inscricao na newsletter.
- O painel administrativo (/admin) agora mostra tela de login; apos autenticar, o
  Supabase client usa o token do usuario e as politicas authenticated permitem o CRUD.
- Todas as politicas sao re-criaveis (DROP IF EXISTS antes de CREATE).
*/

-- =========================
-- Funcao is_admin()
-- =========================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT coalesce(auth.jwt() ->> 'email', '') = 'admin@blogdosgatos.com.br'
$$;

-- =========================
-- posts
-- =========================
DROP POLICY IF EXISTS "anon_select_posts" ON posts;
CREATE POLICY "anon_select_posts" ON posts FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_posts" ON posts;
CREATE POLICY "auth_insert_posts" ON posts FOR INSERT
  TO authenticated WITH CHECK (is_admin());

DROP POLICY IF EXISTS "anon_update_posts" ON posts;
CREATE POLICY "auth_update_posts" ON posts FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "anon_delete_posts" ON posts;
CREATE POLICY "auth_delete_posts" ON posts FOR DELETE
  TO authenticated USING (is_admin());

-- =========================
-- comments
-- =========================
DROP POLICY IF EXISTS "anon_select_comments" ON comments;
CREATE POLICY "anon_select_comments" ON comments FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_comments" ON comments;
CREATE POLICY "public_insert_comments" ON comments FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    author_name IS NOT NULL
    AND length(author_name) BETWEEN 1 AND 60
    AND content IS NOT NULL
    AND length(content) BETWEEN 1 AND 500
  );

DROP POLICY IF EXISTS "anon_delete_comments" ON comments;
CREATE POLICY "auth_delete_comments" ON comments FOR DELETE
  TO authenticated USING (is_admin());

-- =========================
-- newsletter
-- =========================
DROP POLICY IF EXISTS "anon_select_newsletter" ON newsletter;
CREATE POLICY "auth_select_newsletter" ON newsletter FOR SELECT
  TO authenticated USING (is_admin());

DROP POLICY IF EXISTS "anon_insert_newsletter" ON newsletter;
CREATE POLICY "public_insert_newsletter" ON newsletter FOR INSERT
  TO anon, authenticated
  WITH CHECK (email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$');

DROP POLICY IF EXISTS "anon_delete_newsletter" ON newsletter;
CREATE POLICY "auth_delete_newsletter" ON newsletter FOR DELETE
  TO authenticated USING (is_admin());
