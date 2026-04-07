# Plan técnico por etapas - Chile Breeding Tracker

## 1) Arquitectura del proyecto

Monorepo con dos aplicaciones:

- `apps/frontend`: PWA responsive en HTML/CSS/TypeScript (Vite).
- `apps/backend`: API REST en Node.js + Express + TypeScript.
- `db/schema.sql`: esquema PostgreSQL portable a Supabase/Render.
- `docs/`: decisiones de arquitectura y roadmap.

### Flujo de datos

1. Frontend consulta `/api/*`.
2. Backend valida entradas con Zod.
3. Backend persiste en PostgreSQL.
4. Dashboard agrega métricas (ranking, estados, actividad).

## 2) Esquema de base de datos

Tablas iniciales:

- `users`: autenticación básica.
- `varieties`: variedades/líneas y stock de semillas.
- `crosses`: madre/padre, fecha de polinización y lote.
- `plants`: trazabilidad por planta individual.
- `phenotype_scores`: puntuación configurable por fecha.
- `shu_samples`: resultados de laboratorio SHU + documentos.
- `environmental_logs`: ambiente y cultivo (pH, EC, T/H).
- `media_assets`: fotos y archivos por entidad.
- `tasks`: tareas con prioridad y estado.
- `guinness_candidates`: checklist y cronología exportable.

## 3) Entidades principales (dominio)

- `VarietyLine`
- `Cross`
- `Plant`
- `PhenotypeEvaluation`
- `ShuSample`
- `EnvironmentRecord`
- `Task`
- `GuinnessCandidate`
- `MediaAsset`

## 4) Navegación de la app (mobile-first)

- Dashboard
- Líneas
- Cruces
- Plantas
- Tareas

La primera versión usa tabs compactas y paneles con desplazamiento horizontal en tablas para móvil.

## 5) Código inicial funcional (v0)

### Entregado en esta etapa

- API con endpoints:
  - `GET /health`
  - `GET /api/dashboard`
  - `GET /api/varieties`
  - `POST /api/varieties`
  - `GET /api/crosses`
  - `GET /api/plants`
- Frontend PWA base con:
  - Manifest
  - Service Worker simple
  - Dashboard + navegación tab
  - Vista de líneas en tabla responsive
- Esquema PostgreSQL completo para las áreas clave.

## Roadmap siguiente iteración

1. CRUD completo para cruces, plantas, tareas y SHU.
2. Autenticación con JWT + refresh tokens.
3. Subida de archivos a almacenamiento (Supabase Storage/S3).
4. Árbol genealógico visual y ranking avanzado por pesos.
5. Exportador dossier Guinness (PDF/ZIP con trazabilidad).
