# Teamed EOR vs Entity Crossover Calculator

Standalone Next.js 14 App Router application for the Teamed EOR vs Entity Crossover Calculator. Designed to be embedded in teamed.global via iframe.

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment variables**

   Copy `.env.local.example` to `.env.local` and set:

   ```
   HUBSPOT_WEBHOOK_URL=<your HubSpot form/webhook URL>
   NEXT_PUBLIC_GA_ID=<your GA4 measurement ID>
   ```

3. **Run development server**

   ```bash
   npm run dev
   ```

4. **Build for production**

   ```bash
   npm run build
   npm start
   ```

## Deployment (Vercel)

1. Connect your repository to Vercel
2. Add environment variables in the Vercel dashboard:
   - `HUBSPOT_WEBHOOK_URL`
   - `NEXT_PUBLIC_GA_ID`
3. Deploy — no database setup required

## Features

- Multi-step flow: Your Situation → Calculating Your Model → Your Results
- 33 countries with static data (no database)
- Crossover chart with Recharts
- Server-side PDF generation (Crossover Memo)
- Lead capture with HubSpot webhook integration
- Growth reminder with date picker
- GA4 event tracking
