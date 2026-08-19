# Backend

Backend Node.js avec Express, PostgreSQL et Prisma ORM.

## Installation

```bash
npm install
```

## Configuration

Copier `.env.example` vers `.env`, puis adapter `DATABASE_URL` si besoin.

```bash
cp .env.example .env
```

## Base de donnees locale

```bash
docker compose up -d
```

## Prisma

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
```

## Developpement

```bash
npm run dev
```

Routes disponibles:

- `GET /health`
- `GET /health/db`
