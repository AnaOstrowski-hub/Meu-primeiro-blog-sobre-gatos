import type { Article } from './types.ts'
import { cuidados } from './cuidados.ts'
import { alimentacao } from './alimentacao.ts'
import { saude } from './saude.ts'
import { racas } from './racas.ts'
import { comportamento } from './comportamento.ts'
import { curiosidades } from './curiosidades.ts'
import { adocao } from './adocao.ts'

export const ARTICLES: Article[] = [
  ...cuidados,
  ...alimentacao,
  ...saude,
  ...racas,
  ...comportamento,
  ...curiosidades,
  ...adocao,
]

export { type Article, CATEGORIES } from './types.ts'
