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

## Features

- Self-assessment questionnaire (trainer / teacher roles)
- Two-phase scoring (core → excellence)
- PDF export of results
- Admin dashboard with charts and per-user PDF export
- Data stored in browser `localStorage`
