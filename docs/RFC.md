# 📋 RFC-001 — AlbumIQ
## 🏆 Plataforma Inteligente de Seguimiento y Coleccionismo para Álbumes Panini

- **Status:** Draft
- **Author:** JuanFe
- **Created:** 2026-05-10
- **Version:** 0.1

---

# 1. 📝 Resumen

AlbumIQ es una plataforma digital enfocada en el seguimiento, análisis y gestión inteligente de colecciones de láminas del Mundial Panini 2026.

El proyecto busca transformar la experiencia tradicional de coleccionar álbumes físicos mediante herramientas digitales modernas como:

- 📊 Seguimiento de progreso
- 🔁 Gestión de repetidas
- 🤝 Matching inteligente para intercambios
- 📈 Estadísticas avanzadas
- 📷 Scanner automático con IA
- 🌐 Comunidad de coleccionistas

La visión a largo plazo es construir una plataforma extensible para múltiples tipos de colecciones físicas.

---

# 2. 💡 Motivación

La experiencia actual de coleccionar álbumes presenta múltiples fricciones:

- 😤 Difícil seguimiento manual
- 🗂️ Gestión incómoda de repetidas
- 🔄 Intercambios poco eficientes
- 🔍 Falta de estadísticas
- 🤖 Ausencia de herramientas inteligentes
- 📵 Poca integración digital/social

Las aplicaciones existentes suelen limitarse a:
- listas simples
- checklists básicas
- interfaces poco modernas
- poca personalización

AlbumIQ busca convertirse en el "centro de control" del coleccionista. 🎮

---

# 3. 🎯 Objetivos

## 3.1 Objetivos Principales

- ✅ Facilitar el seguimiento del álbum
- ✂️ Reducir fricción en la gestión de láminas
- 🔀 Optimizar intercambios
- 🎮 Gamificar el proceso de colección
- 🧠 Generar insights mediante analítica de datos

---

## 3.2 Objetivos Secundarios

- 👥 Crear comunidad
- 📦 Permitir escalabilidad hacia otros álbumes
- 🏗️ Construir una arquitectura modular
- 👁️ Incorporar visión computacional

---

# 4. 🚀 Alcance Inicial (MVP)

El MVP se enfocará únicamente en resolver el problema principal:

> ❓ "¿Qué láminas tengo, cuáles me faltan y cuáles tengo repetidas?"

---

## 4.1 ✅ Funcionalidades Incluidas

### 🔐 Autenticación
- Registro/Login
- OAuth opcional

### 🗂️ Gestión de Colección
- Marcar láminas:
  - ✅ Disponible
  - 🔁 Repetida
  - ❌ Faltante

### 📊 Dashboard
- Progreso total
- Progreso por selección
- Cantidad de repetidas
- Estadísticas básicas

### 🔗 Compartir Perfil
- URL pública del progreso
- Compartir listas faltantes

---

## 4.2 ❌ Funcionalidades Excluidas del MVP

- 📷 Scanner IA
- 🛒 Marketplace
- 💬 Chat
- 🤖 Matching automático
- 🌐 Sistema social avanzado
- 📚 Múltiples álbumes

---

# 5. 🗺️ Roadmap

---

## 🥇 Fase 1 — MVP

**Objetivo:**
Validar necesidad y uso recurrente.

**Características:**
- 📋 Tracker manual
- 📊 Dashboard básico
- 🔁 Gestión de repetidas
- 📤 Compartir progreso

---

## 🤝 Fase 2 — Social & Trading

**Objetivo:**
Introducir network effects.

**Características:**
- 👫 Amigos
- 🔀 Matching de intercambios
- 📬 Sistema de solicitudes
- 🏅 Rankings

---

## 🤖 Fase 3 — IA & Automatización

**Objetivo:**
Reducir fricción al mínimo.

**Características:**
- 📷 Scanner con cámara
- 🔤 OCR
- 🧠 Detección automática
- 💡 Recomendaciones inteligentes

---

## 🌍 Fase 4 — Plataforma

**Objetivo:**
Expandir fuera del Mundial 2026.

**Características:**
- 📚 Múltiples álbumes
- 🎴 Pokémon
- 🏀 NBA
- ⚽ Copa América
- 🃏 TCGs
- 🛒 Marketplace completo

---

# 6. 🏛️ Arquitectura Técnica

---

## 6.1 🖥️ Frontend

### Stack Propuesto

- ⚛️ React
- ⚡ Vite
- 🔷 TypeScript
- 🎨 TailwindCSS

---

### Razones

- 🚀 Alto rendimiento
- ⚡ Desarrollo rápido
- 🌐 Ecosistema moderno
- 📱 Excelente soporte PWA

---

## 6.2 ⚙️ Backend

### Opción A — Supabase ⭐ (Recomendada para MVP)

#### Servicios Utilizados

- 🐘 PostgreSQL
- 🔐 Auth
- ⚡ Realtime
- 🔧 Edge Functions
- 🗄️ Storage

#### Ventajas

- 🚀 Velocidad de desarrollo
- 🧹 Menos DevOps
- 📈 Escalable inicialmente
- 🔄 Ideal para iteración rápida

---

### Opción B — FastAPI 🐍

#### Ventajas

- 🎛️ Mayor control
- 🏗️ Arquitectura backend robusta
- 🔮 Mejor para lógica compleja futura

#### Desventajas

- 😵 Mayor complejidad inicial
- 🏗️ Más infraestructura

---

## 6.3 📱 Mobile Strategy

El proyecto será inicialmente una:

### Progressive Web App (PWA) 📲

**Razones:**
- ⚡ Instalación rápida
- 📱 Compatibilidad móvil
- 💸 Menor costo de desarrollo
- 🎴 Ideal para uso durante apertura de sobres

---

# 7. 🗃️ Modelo de Datos Inicial

---

### Tabla: `users`

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    username TEXT UNIQUE,
    created_at TIMESTAMP
);
```

### Tabla: `stickers`

```sql
CREATE TABLE stickers (
    id UUID PRIMARY KEY,
    code TEXT,
    team TEXT,
    player_name TEXT,
    rarity TEXT,
    image_url TEXT
);
```

### Tabla: `user_stickers`

```sql
CREATE TABLE user_stickers (
    user_id UUID,
    sticker_id UUID,
    quantity INTEGER DEFAULT 0,
    updated_at TIMESTAMP
);
```

---

# 8. 🤝 Sistema de Matching (Futuro)

Una funcionalidad central será el sistema inteligente de intercambios.

### Inputs
- ❌ Láminas faltantes
- 🔁 Láminas repetidas
- 📍 Ubicación
- ⚙️ Preferencias

### Outputs
- 💡 Match sugerido
- 💰 Valor estimado del intercambio
- 📊 Compatibilidad

### Posibles Algoritmos
- 🔗 Bipartite Matching
- 🕸️ Graph Optimization
- 🧠 Recommendation Systems

---

# 9. 📷 Scanner Inteligente (Futuro)

**Objetivo:**
Permitir registrar láminas automáticamente usando la cámara.

### Tecnologías Posibles
- 🔤 OCR
- 👁️ Computer Vision
- 🧬 Embeddings visuales
- 🖼️ OpenCV
- ☁️ Vision APIs

### Flujo Esperado

```
Usuario abre sobre
        ↓
  Apunta cámara
        ↓
Sistema detecta códigos
        ↓
Láminas agregadas automáticamente
```

---

# 10. 📊 Analítica y Ciencia de Datos

Uno de los diferenciadores principales será la capa analítica.

### Métricas Posibles
- 🎲 Probabilidad de repetidas
- 📦 Estimación de sobres restantes
- 💎 Rareza observada
- 🗺️ Heatmaps de escasez
- 📉 Distribución de repetidas
- 🔭 Simulación de completitud

### Posibles Visualizaciones
- 🔵 Progress Rings
- 🗺️ Heatmaps
- 📊 Distribuciones
- 🕸️ Network Graphs
- 📈 Completion Forecasts

---

# 11. ⚠️ Riesgos

### 🚨 Riesgo: Baja retención

**Mitigación:**
- 🎮 Gamificación
- 👥 Componentes sociales
- 📤 Insights compartibles

### 🚨 Riesgo: Complejidad temprana

**Mitigación:**
- 🪶 MVP extremadamente pequeño
- 🔄 Iteración rápida

### 🚨 Riesgo: Dependencia de evento temporal

**Mitigación:**
- 🏗️ Diseñar arquitectura multi-álbum desde el inicio

---

# 12. 📏 KPIs

### 📦 Producto
- 👤 Usuarios activos diarios
- 🔄 Frecuencia de actualización
- 📊 % de álbum completado

### 🌐 Comunidad
- 🤝 Intercambios realizados
- ✅ Matches exitosos
- 📤 Shares de progreso

### 📅 Retención
- D1
- D7
- D30

---

# 13. 🌟 Visión a Largo Plazo

AlbumIQ no busca ser únicamente un tracker del Mundial 2026.

La visión es construir:

> 🏆 **"La plataforma definitiva para coleccionistas físicos."**

Una mezcla entre:

- 📋 tracker
- 🌐 red social
- 🛒 marketplace
- 📊 sistema analítico
- 🤖 plataforma inteligente de matching

---

# 14. ❓ Preguntas Abiertas

- 📶 ¿Debe existir modo offline?
- 💎 ¿Cómo manejar rarezas especiales?
- ✅ ¿Cómo validar intercambios?
- 👥 ¿Qué tan social debe ser el producto?
- 📱 ¿Conviene app nativa eventualmente?
- 💰 ¿Cómo monetizar?

---

# 15. ⚡ Decisiones Iniciales

| Área | Decisión |
|------|----------|
| 🖥️ Frontend | React + Vite |
| ⚙️ Backend | Supabase |
| 📱 Mobile | PWA |
| 🐘 Base de datos | PostgreSQL |
| 🏗️ Arquitectura | Modular |
| 🎯 Prioridad | Speed over perfection |

---

# 16. 🏁 Conclusión

AlbumIQ busca modernizar una experiencia nostálgica usando:

- 💻 Software moderno
- 🔬 Ciencia de datos
- 🤖 Sistemas inteligentes
- 👥 Comunidad

El objetivo inicial no es construir una plataforma compleja, sino resolver de forma excelente el problema central del coleccionista:

> 🎯 **Saber qué tiene, qué le falta y cómo completar su álbum más rápido.**
