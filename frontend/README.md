# Resume Matcher

Paste your resume and a job description — instantly see how well you match.

**Live demo:** https://frontend-kappa-beige-27.vercel.app

## Features

- Upload resume as PDF, DOCX, or TXT — text is extracted automatically
- Keyword analysis against the job description with a match score
- Phrase matching for common tech terms (machine learning, CI/CD, REST API, etc.)
- Score breakdown: keyword match (70%) + phrase match (30%)
- Actionable suggestions to improve your resume for ATS
- Export results as PDF via browser print

## Tech Stack

- React 19 + Vite
- `pdfjs-dist` for PDF parsing
- `mammoth` for DOCX parsing

## Getting Started

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
```
