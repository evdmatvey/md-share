# MDShare

Веб приложение для шаринга текста в .md формате

- `apps/web` — React 19 + Vite
- `apps/api` — NestJS + Prisma 7
- `packages/contracts` — общие Zod-схемы

## Требования

- Node.js 22+
- pnpm
- Docker (Postgres)

## Быстрый старт

```bash
cp .env.example .env

pnpm install
docker compose up -d
pnpm --filter @md-share/api prisma:migrate
pnpm dev
```

Конфигурация — один файл `.env` в корне: Postgres (`POSTGRES_*`), API (`PORT`, `DATABASE_URL`, `CORS_ORIGIN`), web (`VITE_PORT`, `VITE_API_URL`).

## Команды

| Команда                                       | Что делает            |
| --------------------------------------------- | --------------------- |
| `pnpm dev`                                    | web + api параллельно |
| `pnpm dev:web`                                | Vite                  |
| `pnpm dev:api`                                | Nest watch            |
| `pnpm build`                                  | сборка всех пакетов   |
| `pnpm lint` / `pnpm format`                   | проверки              |
| `pnpm --filter @md-share/web fsd:lint`        | Steiger               |
| `pnpm --filter @md-share/api prisma:generate` | Prisma Client         |
| `pnpm --filter @md-share/api prisma:migrate`  | миграции              |
