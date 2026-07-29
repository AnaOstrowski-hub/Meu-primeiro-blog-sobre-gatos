/*
# Restringir politicas authenticated ao admin

1. Contexto
As politicas anteriores para INSERT/UPDATE/DELETE em posts, comments e newsletter
usavam `TO authenticated` com `USING (true)` / `WITH CHECK (true)`. Isso permite
que QUALQUER usuario autenticado (nao apenas o admin) modifique todos os dados.
Agora as politicas verificam se o usuario autenticado e o administrador do blog.

2. Mudancas

## Funcao nova: is_admin()
- SECURITY DEFINER, retorna booleano.
- Verifica se o email do usuario autenticado (via auth.jwt()) e o email do admin.
- Usada em todas as politicas authenticated para restringir acesso ao admin.

## posts
- INSERT: WITH CHECK (is_admin()) — apenas o admin cria postagens.
- UPDATE: USING (is_admin()) WITH CHECK (is_admin()) — apenas o admin edita.
- DELETE: USING (is_admin()) — apenas o admin exclui.

## comments
- DELETE: USING (is_admin()) — apenas o admin modera/exclui comentarios.

## newsletter
- SELECT: USING (is_admin()) — apenas o admin ve a lista de e-mails.
- DELETE: USING (is_admin()) — apenas o admin remove inscricoes.

3. Notas
- A leitura publica (SELECT em posts e comments) permanece com TO anon, authenticated.
- O cadastro publico na newsletter e os comentarios publicos permanecem abertos com validacao.
- Nenhuma coluna ou tabela foi alterada.
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
-- SELECT permanece publico
DROP POLICY IF EXISTS "anon_select_posts" ON posts;
CREATE POLICY "anon_select_posts" ON posts FOR SELECT
  TO anon, authenticated USING (true);

-- INSERT: apenas admin
DROP POLICY IF EXISTS "auth_insert_posts" ON posts;
CREATE POLICY "auth_insert_posts" ON posts FOR INSERT
  TO authenticated WITH CHECK (is_admin());

-- UPDATE: apenas admin
DROP POLICY IF EXISTS "auth_update_posts" ON posts;
CREATE POLICY "auth_update_posts" ON posts FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- DELETE: apenas admin
DROP POLICY IF EXISTS "auth_delete_posts" ON posts;
CREATE POLICY "auth_delete_posts" ON posts FOR DELETE
  TO authenticated USING (is_admin());

-- =========================
-- comments
-- =========================
-- SELECT permanece publico
DROP POLICY IF EXISTS "anon_select_comments" ON comments;
CREATE POLICY "anon_select_comments" ON comments FOR SELECT
  TO anon, authenticated USING (true);

-- INSERT permanece publico com validacao
DROP POLICY IF EXISTS "public_insert_comments" ON comments;
CREATE POLICY "public_insert_comments" ON comments FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    author_name IS NOT NULL
    AND length(author_name) BETWEEN 1 AND 60
    AND content IS NOT NULL
    AND length(content) BETWEEN 1 AND 500
  );

-- DELETE: apenas admin
DROP POLICY IF EXISTS "auth_delete_comments" ON comments;
CREATE POLICY "auth_delete_comments" ON comments FOR DELETE
  TO authenticated USING (is_admin());

-- =========================
-- newsletter
-- =========================
-- SELECT: apenas admin
DROP POLICY IF EXISTS "auth_select_newsletter" ON newsletter;
CREATE POLICY "auth_select_newsletter" ON newsletter FOR SELECT
  TO authenticated USING (is_admin());

-- INSERT permanece publico com validacao de email
DROP POLICY IF EXISTS "public_insert_newsletter" ON newsletter;
CREATE POLICY "public_insert_newsletter" ON newsletter FOR INSERT
  TO anon, authenticated
  WITH CHECK (email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$');

-- DELETE: apenas admin
DROP POLICY IF EXISTS "auth_delete_newsletter" ON newsletter;
CREATE POLICY "auth_delete_newsletter" ON newsletter FOR DELETE
  TO authenticated USING (is_admin());
