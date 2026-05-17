# ClearSign

AI-powered contract analysis that flags high-risk clauses, missing protections, and recommended actions — in plain English.

**GitHub:** https://github.com/autobots-transform/clearsign

## Features

- Upload a contract (PDF or text) and get an instant risk score (1–10)
- Identifies high-risk clauses with confidence scores and exact quotes
- Flags missing protections
- Provides a plain English summary and top 3 recommended actions
- Actionable options for high-risk contracts (score 7+) — no attorney required

## Getting Started

1. Clone the repo and install dependencies:
   ```bash
   git clone https://github.com/autobots-transform/clearsign.git
   cd clearsign
   npm install
   ```

2. Copy `.env.example` to `.env` and add your API key:
   ```bash
   cp .env.example .env
   ```

3. Start the dev server:
   ```bash
   npm run dev
   ```

## Tech Stack

- React + Vite
- Custom CSS (no UI framework)
