# Military Trainer & Teacher Self-Assessment

A self-assessment web application for military trainers and teachers, with reference criteria, PDF reports, and an admin dashboard.

> **Note:** The application UI is fully designed in **Arabic** (RTL). Repository documentation is in English.

## Repository contents

| Path | Description |
|------|-------------|
| `self-assessment/` | React + Vite web app (Arabic UI) |
| `generate_criteria_pdf.py` | Script to generate criteria PDF (Arabic) |
| `trainer_teacher_criteria.pdf` | Reference criteria document (Arabic PDF) |

## Quick start

```bash
cd self-assessment
npm install
cp .env.example .env   # then set VITE_ADMIN_PASSWORD in .env
npm run dev
```

Open http://localhost:5173

## Admin panel

- Access via the **Admin** button in the header
- Password is set via environment variable `VITE_ADMIN_PASSWORD` (see `.env.example`)
- **Do not commit `.env` or expose the password in the repository**

For production (Vercel, Netlify, etc.), set `VITE_ADMIN_PASSWORD` in your hosting provider's environment settings.

## Assessment levels

**Trainer:** Successful → Distinguished → Development path  
**Teacher:** Successful → Distinguished → Development path

Two-phase flow:
1. **12 core criteria** — must pass to continue
2. **12 excellence criteria** — only if phase 1 is passed

## Build for production

```bash
cd self-assessment
npm run build
```

Output: `self-assessment/dist/`

## Generate criteria PDF

```bash
pip install fpdf2 arabic-reshaper python-bidi
python generate_criteria_pdf.py
```

## License

Private / internal use — adjust as needed.
