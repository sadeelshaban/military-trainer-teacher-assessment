# Al-Istiqlal University Staff Evaluation Committee

**Evaluation System** for trainers and teachers at Al-Istiqlal University.

> **Important:** The entire application interface is in **Arabic** (right-to-left). This README is written in English for developers and visitors browsing the repository.

## Live app

**https://al-istiqlal-staff-evaluation.vercel.app**

Share this link with staff who need to complete their evaluation.

## Overview

The system lets trainers and teachers:

1. Enter their name and select their role (trainer or teacher)
2. Answer **24 questions** in one questionnaire (12 success criteria + 12 excellence criteria)
3. Receive an automatic level classification with feedback on strengths and gaps
4. Download an **evaluation report** as PDF

Administrators use a password-protected dashboard to view all submissions, statistics, and export individual reports.

## Evaluation levels

| Level | Meaning |
|-------|---------|
| **Development path** | Success criteria not met |
| **Successful** (trainer / teacher) | Success criteria met; excellence needs improvement |
| **Distinguished** (trainer / teacher) | Both success and excellence criteria met |

If success criteria are **not** met, the report shows that **excellence was not achieved**, even when all 24 questions were answered.

## Repository layout

| Path | Description |
|------|-------------|
| `self-assessment/` | React + Vite web app (Arabic UI) |
| `supabase/migrations/` | Database schema |
| `generate_criteria_pdf.py` | Script to generate the criteria reference PDF |
| `trainer_teacher_criteria.pdf` | Printable criteria document (Arabic) |

## Tech stack

React · Vite · Supabase · Vercel · GitHub Actions (CI)

## Admin panel

Click **الإدارة** in the app header. The dashboard includes charts, a full assessment list, and PDF export per user.

## Generate criteria PDF

```bash
pip install fpdf2 arabic-reshaper python-bidi
python generate_criteria_pdf.py
```
