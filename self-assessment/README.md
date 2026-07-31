# Evaluation System (Web App)

Arabic-language frontend for the **Al-Istiqlal University Staff Evaluation Committee**.

> All user-facing text, labels, questions, and reports are in **Arabic (RTL)**. This file is in English for technical documentation only.

**Live app:** https://al-istiqlal-staff-evaluation.vercel.app

## Features

- University branding (logo, committee name)
- Role selection: trainer or teacher
- Single 24-question flow (success + excellence)
- Automatic scoring and gap analysis
- **Evaluation report** PDF export
- Admin dashboard with statistics and per-user PDFs

## Folder structure

```
src/components/   Screens (welcome, questionnaire, results, admin)
src/data/         Criteria and questions (Arabic)
src/utils/        Scoring, storage, PDF export
src/lib/          Supabase client
public/logo.png   University logo
```

## Scoring (summary)

**Success:** average ≥ 3.5 on 12 core criteria, plus rules for critical criteria.

**Excellence:** only scored after success is met: average ≥ 4.0, at least 9 criteria at 4+, at least 5 at 5/5.

See the root [README](../README.md) for full project documentation.
