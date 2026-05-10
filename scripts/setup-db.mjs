// scripts/setup-db.mjs
// Corre la migración + seed directo contra la Supabase Management API.
// Requiere en .env.local:
//   SUPABASE_PAT          → app.supabase.com/account/tokens
//   SUPABASE_PROJECT_REF  → Settings → General → Reference ID

import { readFileSync } from 'node:fs'

// Lee .env.local sin dependencias externas
function loadEnv(path = '.env.local') {
  try {
    const lines = readFileSync(path, 'utf8').split('\n')
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eq = trimmed.indexOf('=')
      if (eq === -1) continue
      const key = trimmed.slice(0, eq).trim()
      const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '')
      process.env[key] = val
    }
  } catch {
    // sin .env.local → usa variables de entorno del sistema
  }
}

loadEnv()

const PAT = process.env.SUPABASE_PAT
const REF = process.env.SUPABASE_PROJECT_REF

if (!PAT || !REF) {
  console.error('\nFaltan variables en .env.local:')
  if (!PAT) console.error('  SUPABASE_PAT          → app.supabase.com/account/tokens')
  if (!REF) console.error('  SUPABASE_PROJECT_REF  → Supabase dashboard → Settings → General')
  process.exit(1)
}

async function runSQL(label, sql) {
  process.stdout.write(`→ ${label}... `)

  const res = await fetch(`https://api.supabase.com/v1/projects/${REF}/database/query`, {
    method:  'POST',
    headers: {
      Authorization:  `Bearer ${PAT}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  })

  const body = await res.json().catch(() => ({}))

  if (!res.ok) {
    console.error(`ERROR (${res.status})`)
    console.error(JSON.stringify(body, null, 2))
    process.exit(1)
  }

  console.log('✓')
  return body
}

const migration = readFileSync('supabase/migrations/001_initial_schema.sql', 'utf8')
const seed      = readFileSync('supabase/seed.sql', 'utf8')

console.log(`\nConectando al proyecto: ${REF}\n`)

await runSQL('Migración (schema)', migration)
await runSQL('Seed (980 láminas)', seed)

console.log('\n✓ Base de datos lista. Abre http://localhost:5173\n')
