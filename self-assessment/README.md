# Self-Assessment App

React + Vite application for military trainer/teacher self-assessment.

> **UI language:** Arabic (RTL). This README is in English for repository documentation.

## Setup

```bash
npm install
cp .env.example .env
```

Edit `.env` and set:

```
VITE_ADMIN_PASSWORD=your_secure_password
```

## Development

```bash
npm run dev
```

## Production build

```bash
npm run build
```

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_ADMIN_PASSWORD` | Yes (for admin) | Admin panel password. Never commit to git. |
| `VITE_SUPABASE_URL` | Yes (production) | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes (production) | Supabase anon/public key |
| `VITE_BASE_PATH` | Optional | Custom base path for static hosting |

Without Supabase env vars, assessments fall back to browser `localStorage` (local dev only).

## Live demo

https://military-trainer-assessment.vercel.app

## Features

- Self-assessment questionnaire (trainer / teacher roles)
- Two-phase scoring (core → excellence)
- PDF export of results
- Admin dashboard with charts and per-user PDF export
- Assessments stored in **Supabase** (shared across devices)
