# 🗺️ plan.md — AlbumIQ
## Arquitectura Limpia + Roadmap Iterativo

- **Basado en:** RFC-001 v0.1
- **Última actualización:** 2026-05-10
- **Principio guía:** Ship fast, refactor right

---

# 1. 🏛️ Arquitectura Limpia — Visión General

AlbumIQ sigue los principios de **Clean Architecture** (Robert C. Martin):
las dependencias apuntan siempre **hacia adentro**, nunca hacia afuera.

```
┌──────────────────────────────────────────────────────┐
│                   Presentation                        │
│         (React · Pages · Components · Hooks)          │
│  ┌────────────────────────────────────────────────┐   │
│  │                Application                     │   │
│  │         (Use Cases · DTOs · Ports)             │   │
│  │  ┌──────────────────────────────────────────┐  │   │
│  │  │               Domain                     │  │   │
│  │  │  (Entities · Value Objects · Interfaces) │  │   │
│  │  └──────────────────────────────────────────┘  │   │
│  └────────────────────────────────────────────────┘   │
│  ┌────────────────────────────────────────────────┐   │
│  │             Infrastructure                     │   │
│  │      (Supabase · Storage · Auth · APIs)        │   │
│  └────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────┘
```

### Regla fundamental
> El `domain` no importa nada externo. El `application` solo importa `domain`.
> `infrastructure` y `presentation` implementan las interfaces del `domain/application`.

---

# 2. 📁 Estructura del Proyecto

```
panini_2026/
├── docs/
│   ├── RFC.md
│   └── plan.md                        ← este archivo
│
├── src/
│   │
│   ├── domain/                        # Capa 1 — Núcleo puro
│   │   ├── entities/
│   │   │   ├── Sticker.ts             # Entidad lámina
│   │   │   ├── Collection.ts          # Colección de un usuario
│   │   │   ├── User.ts                # Usuario del sistema
│   │   │   └── Trade.ts              # (Fase 2) Intercambio
│   │   ├── value-objects/
│   │   │   ├── StickerCode.ts         # ej. "ARG-01" validado
│   │   │   ├── Quantity.ts            # >= 0, con lógica de repetidas
│   │   │   └── Progress.ts            # 0–100%, calculado
│   │   ├── repositories/              # Interfaces (puertos)
│   │   │   ├── IStickerRepository.ts
│   │   │   ├── ICollectionRepository.ts
│   │   │   └── IUserRepository.ts
│   │   └── services/
│   │       └── CollectionDomainService.ts  # Lógica de negocio pura
│   │
│   ├── application/                   # Capa 2 — Casos de uso
│   │   ├── use-cases/
│   │   │   ├── collection/
│   │   │   │   ├── GetCollectionUseCase.ts
│   │   │   │   ├── AddStickerUseCase.ts
│   │   │   │   ├── RemoveStickerUseCase.ts
│   │   │   │   └── GetMissingStickersUseCase.ts
│   │   │   └── auth/
│   │   │       ├── LoginUseCase.ts
│   │   │       └── RegisterUseCase.ts
│   │   ├── dtos/
│   │   │   ├── StickerDTO.ts
│   │   │   └── CollectionDTO.ts
│   │   └── ports/                     # Contratos para infraestructura
│   │       ├── IAuthService.ts
│   │       └── IStorageService.ts
│   │
│   ├── infrastructure/                # Capa 3 — Implementaciones externas
│   │   ├── supabase/
│   │   │   ├── client.ts              # Supabase client singleton
│   │   │   ├── SupabaseStickerRepo.ts
│   │   │   ├── SupabaseCollectionRepo.ts
│   │   │   └── SupabaseUserRepo.ts
│   │   ├── auth/
│   │   │   └── SupabaseAuthService.ts
│   │   └── storage/
│   │       └── SupabaseStorageService.ts
│   │
│   ├── presentation/                  # Capa 4 — UI
│   │   ├── components/
│   │   │   ├── ui/                    # Componentes genéricos (Button, Card…)
│   │   │   ├── stickers/              # StickerGrid, StickerCard, StickerBadge
│   │   │   └── collection/            # ProgressRing, TeamSection, Dashboard
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── CollectionPage.tsx
│   │   │   └── PublicProfilePage.tsx
│   │   ├── hooks/
│   │   │   ├── useCollection.ts       # Orquesta use cases
│   │   │   ├── useAuth.ts
│   │   │   └── useProgress.ts
│   │   └── stores/
│   │       ├── collectionStore.ts     # Zustand — estado global de la colección
│   │       └── authStore.ts
│   │
│   └── main.tsx
│
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   └── seed.sql                       # Datos de láminas del Mundial
│
├── public/
├── index.html
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

# 3. 🗃️ Modelo de Datos — Supabase

### Migración 001 — Schema inicial

```sql
-- Tabla de láminas (catálogo estático del Mundial 2026)
CREATE TABLE stickers (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code        TEXT UNIQUE NOT NULL,   -- "ARG-01", "BRA-GK"
    number      INTEGER NOT NULL,
    team        TEXT NOT NULL,
    player_name TEXT,
    position    TEXT,
    rarity      TEXT DEFAULT 'common',  -- common | rare | legend
    image_url   TEXT,
    section     TEXT NOT NULL           -- "groups" | "stadiums" | "trophy"
);

-- Usuarios (extiende auth.users de Supabase)
CREATE TABLE profiles (
    id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username   TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    is_public  BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Colección de cada usuario
CREATE TABLE user_stickers (
    user_id    UUID REFERENCES profiles(id) ON DELETE CASCADE,
    sticker_id UUID REFERENCES stickers(id),
    quantity   INTEGER DEFAULT 0 CHECK (quantity >= 0),
    updated_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (user_id, sticker_id)
);

-- Índices de rendimiento
CREATE INDEX idx_user_stickers_user ON user_stickers(user_id);
CREATE INDEX idx_stickers_team ON stickers(team);

-- RLS: cada usuario solo ve y edita su colección
ALTER TABLE user_stickers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own collection" ON user_stickers
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read public profiles" ON profiles
    FOR SELECT USING (is_public = true OR auth.uid() = id);
CREATE POLICY "edit own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);
```

---

# 4. 🔄 Flujo de Datos

```
Usuario → Hook (presentation)
              ↓
         Use Case (application)
              ↓
         Repository Interface (domain)
              ↓
         Supabase Repo (infrastructure)
              ↓
         Supabase DB
```

Los hooks nunca hablan directamente a Supabase.
Los use cases nunca importan React.
Las entidades domain no conocen Supabase.

---

# 5. 📦 Etapas de Desarrollo

---

## ⚡ Etapa 0 — Scaffolding (1–2 días)

**Objetivo:** Proyecto arriba, CI verde, deploy base funcionando.

### Tareas

- [ ] `npm create vite@latest` con React + TypeScript
- [ ] Configurar TailwindCSS v4
- [ ] Configurar ESLint + Prettier + Husky
- [ ] Crear proyecto en Supabase (dev + prod)
- [ ] Variables de entorno (`.env.local`)
- [ ] Deploy inicial en Vercel/Netlify
- [ ] Estructura de carpetas según sección 2
- [ ] Migración 001 ejecutada en Supabase
- [ ] Seed de láminas del Mundial 2026

**Criterio de éxito:** `npm run dev` corre limpio, Supabase conectado, deploy automático desde `main`.

---

## 🥇 Etapa 1 — MVP Core (1–2 semanas)

**Objetivo:** Un usuario puede registrarse, marcar láminas y ver su progreso.

### 1.1 Domain

- [ ] Entidad `Sticker` (code, team, rarity, section)
- [ ] Entidad `Collection` con métodos:
  - `addSticker(stickerId, qty)`
  - `removeSticker(stickerId)`
  - `getMissing(): Sticker[]`
  - `getDuplicates(): Sticker[]`
  - `getProgress(): Progress`
- [ ] Value Object `StickerCode` (validación formato)
- [ ] Value Object `Progress` (total, by team, by section)
- [ ] Interface `ICollectionRepository`

### 1.2 Application

- [ ] `GetCollectionUseCase` — carga colección del usuario
- [ ] `AddStickerUseCase` — marca una lámina como disponible/repetida
- [ ] `RemoveStickerUseCase` — desmarca una lámina
- [ ] `GetMissingStickersUseCase` — lista de faltantes
- [ ] `LoginUseCase` / `RegisterUseCase`

### 1.3 Infrastructure

- [ ] `SupabaseCollectionRepo` implementando `ICollectionRepository`
- [ ] `SupabaseAuthService` implementando `IAuthService`
- [ ] Cliente Supabase singleton con tipos generados

### 1.4 Presentation

- [ ] `authStore` — sesión global
- [ ] `collectionStore` — estado de la colección en memoria
- [ ] `useCollection` hook — expone add/remove/get a la UI
- [ ] `LoginPage` — email/password + OAuth Google
- [ ] `CollectionPage` — grid de láminas por equipo
  - Filtros: Todas / Tengo / Me faltan / Repetidas
  - Toggle por lámina (click para marcar/desmarcar)
- [ ] `DashboardPage` — resumen visual
  - Progress ring total
  - Progreso por selección (top 5)
  - Contador de repetidas
- [ ] `PublicProfilePage` — vista compartible `/u/:username`

**Criterio de éxito:** Un amigo puede usar la app en su celular para marcar su álbum completo.

---

## 🤝 Etapa 2 — Social & Trading (2–3 semanas)

**Objetivo:** Los usuarios pueden conectarse y coordinar intercambios.

### Modelo de datos adicional

```sql
CREATE TABLE friendships (
    requester_id UUID REFERENCES profiles(id),
    addressee_id UUID REFERENCES profiles(id),
    status TEXT DEFAULT 'pending',  -- pending | accepted | blocked
    created_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (requester_id, addressee_id)
);

CREATE TABLE trade_requests (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_user_id UUID REFERENCES profiles(id),
    to_user_id   UUID REFERENCES profiles(id),
    offered      UUID[],  -- sticker_ids ofrecidos
    requested    UUID[],  -- sticker_ids pedidos
    status       TEXT DEFAULT 'pending',
    created_at   TIMESTAMPTZ DEFAULT now()
);
```

### Domain nuevo

- [ ] Entidad `Trade` con reglas de validación
- [ ] `ITradingRepository` interface
- [ ] `MatchingDomainService` — lógica de compatibilidad

### Application nuevo

- [ ] `FindMatchesUseCase` — usuarios con mis repetidas y que me faltan a mí
- [ ] `ProposeTrade` / `AcceptTrade` / `RejectTrade` use cases

### Presentation nuevo

- [ ] `MatchesPage` — lista de matches compatibles
- [ ] `TradePage` — detalle del intercambio propuesto
- [ ] `FriendsPage` — gestión de amigos
- [ ] Notificaciones en tiempo real (Supabase Realtime)
- [ ] `RankingsPage` — top coleccionistas

**Criterio de éxito:** Dos usuarios coordinan y completan un intercambio dentro de la app.

---

## 🤖 Etapa 3 — IA & Automatización (3–4 semanas)

**Objetivo:** Registrar láminas con la cámara sin tocar el teclado.

### Domain nuevo

- [ ] Port `IScannerService` — interfaz agnóstica a la tecnología

### Application nuevo

- [ ] `ScanStickerUseCase` — recibe imagen, retorna `StickerCode[]`

### Infrastructure nuevo

- [ ] `VisionScannerService` — integración con Google Vision API u OpenAI Vision
- [ ] Pipeline: imagen → OCR → match con catálogo → add sticker

### Presentation nuevo

- [ ] `ScannerPage` — captura de cámara
  - Preview en tiempo real
  - Detección de código
  - Confirmación antes de agregar
- [ ] `AIRecommendationsWidget` — "abre estos sobres para completar más rápido"
- [ ] `SimulatorPage` — simulador probabilístico de completitud

**Criterio de éxito:** Un sobre de 5 láminas puede marcarse en < 10 segundos con la cámara.

---

## 🌍 Etapa 4 — Plataforma Multi-Álbum (roadmap futuro)

**Objetivo:** AlbumIQ funciona para cualquier colección física.

### Cambios arquitectónicos clave

- Abstraer `Album` como entidad raíz (actualmente implícita como "Mundial 2026")
- `stickers` pasa a depender de `album_id`
- Sistema de templates de álbum (comunidad puede crear álbumes)
- Marketplace con sistema de valoración

### Álbumes target
- Panini Copa América
- Pokémon TCG
- NBA Top Shot
- Liga MX

**Criterio de éxito:** Un usuario puede tener 3 colecciones activas de distintos álbumes simultáneamente.

---

# 6. 🧪 Estrategia de Testing

```
Pirámide de testing
─────────────────────
      [E2E]           ← Playwright: flujos críticos (login → marcar → compartir)
    [Integration]     ← Vitest: use cases con repos reales en Supabase local
  [Unit Tests]        ← Vitest: domain entities y value objects
```

### Qué testear sí o sí

| Capa | Qué | Con qué |
|------|-----|---------|
| Domain | Entities, Value Objects | Vitest (puro, sin mocks) |
| Application | Use Cases | Vitest + repos mock |
| Infrastructure | Repos de Supabase | Vitest + Supabase local |
| E2E | Login, marcar lámina, compartir | Playwright |

### Qué NO testear

- Componentes React triviales
- Wiring/DI de infraestructura
- CSS/Tailwind

---

# 7. 🔧 Convenciones de Código

### Naming

```
Entidades:     PascalCase       → Collection, Sticker
Use Cases:     VerbNounUseCase  → AddStickerUseCase
Repositories:  IEntityRepo      → ICollectionRepository
Stores:        camelCaseStore   → collectionStore
Hooks:         useCamelCase     → useCollection
DTOs:          EntityDTO        → CollectionDTO
```

### Reglas de importación

```
✅ presentation → application
✅ presentation → domain (solo tipos)
✅ application  → domain
✅ infrastructure → domain
❌ domain       → application / infrastructure / presentation
❌ application  → infrastructure / presentation
❌ infrastructure → presentation
```

### Commits (Conventional Commits)

```
feat(collection): add duplicate sticker detection
fix(auth): handle expired session on mobile
refactor(domain): extract Progress value object
test(use-cases): add GetCollection integration tests
```

---

# 8. 🚦 Definición de Done por Etapa

Una etapa está **Done** cuando:

1. ✅ Todos los criterios de éxito están cumplidos
2. ✅ Tests unitarios de domain/application pasando
3. ✅ Sin errores de TypeScript (`tsc --noEmit`)
4. ✅ Sin warnings de ESLint
5. ✅ Deploy en producción funcionando
6. ✅ Al menos 1 usuario real lo usó y dio feedback

---

# 9. 🔐 Seguridad & Privacidad

- **RLS activo en todas las tablas** — nadie accede a datos ajenos
- **Perfiles privados por defecto opcionalmente** — `is_public` flag
- **No almacenar datos sensibles** — solo username, no email expuesto en UI
- **Tokens de Supabase en variables de entorno** — nunca en el código
- **Rate limiting** en Edge Functions para el scanner IA

---

# 10. 📊 Decisiones de Arquitectura Registradas

| # | Decisión | Alternativa | Razón |
|---|----------|-------------|-------|
| 1 | Supabase sobre FastAPI | FastAPI propio | Velocidad de MVP, menos DevOps |
| 2 | PWA sobre React Native | App nativa | Un solo codebase, deploy instantáneo |
| 3 | Zustand sobre Redux | Redux Toolkit | Menos boilerplate para este tamaño |
| 4 | Clean Architecture | Feature-based folders | Permite escalar sin refactor mayor |
| 5 | Use Cases explícitos | Lógica en hooks | Testeable sin React, portable |

---

# 11. ⏱️ Timeline Estimado

```
Semana 1    │ Etapa 0 + Etapa 1.1/1.2 (Domain + Application)
Semana 2    │ Etapa 1.3/1.4 (Infrastructure + Presentation MVP)
Semana 3    │ Etapa 1 — pulido, testing, deploy, feedback real
Semana 4–6  │ Etapa 2 — Social & Trading
Semana 7–10 │ Etapa 3 — Scanner IA
Semana 11+  │ Etapa 4 — Plataforma (post-Mundial)
```

> ⚠️ El Mundial 2026 comienza en **junio 2026**. El MVP debe estar live para esa fecha.

---

# 12. 🔗 Referencias

- [RFC-001](./RFC.md) — Especificación del producto
- [Clean Architecture — Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Supabase Docs](https://supabase.com/docs)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
