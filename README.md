# ClearSign

AI-powered contract analysis that flags high-risk clauses, missing protections, and recommended actions — in plain English.

**GitHub:** https://github.com/autobots-transform/clearsign

## Features

- Upload a contract (PDF or text) and get an instant risk score (1–10)
- Identifies high-risk clauses with confidence scores and exact quotes
- Flags missing protections
- Provides a plain English summary and top 3 recommended actions
- Actionable options for high-risk contracts (score 7+) — no attorney required

## Prerequisites

ClearSign requires the **RocketRide pipeline** to be running as its AI backend. Set that up first before running this app.

1. Clone and configure the pipeline project:
   ```bash
   git clone https://github.com/autobots-transform/rocketride-ride.git
   ```
2. Open the project in RocketRide, add your Gemini API key to the `llm_gemini_1` component, and start the pipeline.
3. Once the pipeline is running, copy the **webhook bearer token** from the `webhook_1` component — you'll need it in the step below.

## Getting Started

1. Clone the repo and install dependencies:
   ```bash
   git clone https://github.com/autobots-transform/clearsign.git
   cd clearsign
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```

   ```env
   VITE_API_KEY=        # Bearer token from the webhook_1 component in RocketRide
   VITE_GEMINI_API_KEY= # Your Google Gemini API key
   ```

3. Start the dev server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) and upload a contract.

## How It Works

1. You upload a contract PDF via the ClearSign UI
2. The file is sent to the RocketRide pipeline via webhook
3. The pipeline parses the contract, anonymizes sensitive text, and runs it through Gemini
4. Results are returned as a structured risk analysis and displayed in the UI

## Tech Stack

- React + Vite
- Custom CSS (no UI framework)
- RocketRide (AI pipeline backend)
- Google Gemini (LLM)
