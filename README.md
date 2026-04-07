# Chile Breeding Tracker (PWA)

Primera versión funcional para gestionar un programa de mejora genética de chiles con trazabilidad.

## Estructura

- `apps/frontend`: PWA (Vite + TypeScript)
- `apps/backend`: API REST (Express + TypeScript)
- `db/schema.sql`: esquema PostgreSQL
- `docs/technical-plan.md`: arquitectura y roadmap

## Requisitos

- Node.js 20+
- PostgreSQL 14+

## Configuración

```bash
npm install
cp apps/backend/.env.example apps/backend/.env
```

Crear `apps/backend/.env` con:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/chile_tracker
PORT=4000
```

## Ejecutar

```bash
npm run dev:backend
npm run dev:frontend
```

Frontend: http://localhost:5173  
Backend: http://localhost:4000

## Base de datos

Aplicar esquema:

```bash
psql "$DATABASE_URL" -f db/schema.sql
```
