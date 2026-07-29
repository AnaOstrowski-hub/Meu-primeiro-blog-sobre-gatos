import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'

const url = process.env.VITE_SUPABASE_URL || readFileSync('.env', 'utf8').match(/VITE_SUPABASE_URL=(.*)/)?.[1]
const key = process.env.VITE_SUPABASE_ANON_KEY || readFileSync('.env', 'utf8').match(/VITE_SUPABASE_ANON_KEY=(.*)/)?.[1]

const supabase = createClient(url, key)

import { ARTICLES } from './articles-data.ts'

async function seed() {
  console.log(`Seeding ${ARTICLES.length} articles...`)
  const { data, error } = await supabase.from('posts').upsert(ARTICLES, { onConflict: 'slug' }).select('slug')
  if (error) { console.error('SEED ERROR:', error); process.exit(1) }
  console.log(`Inserted ${data?.length} articles.`)
}
seed()
