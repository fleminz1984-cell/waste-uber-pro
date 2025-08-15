# The Waste Game — Pro (Full Stack)

Uber-style platform for independent waste carriers / man & van / removals.

## What’s inside
- **Frontend**: React + Vite + Tailwind
- **Firebase**: Auth, Firestore, Storage (real-time)
- **Stripe (via Cloud Functions)**: create checkout + webhook to mark jobs as **paid**
- **Flows**: Post → Quote → Accept → **Pay** → Status → Complete

## Quickstart
1) Create a Firebase project. Enable **Auth (Email/Password)**, **Firestore**, **Storage**.
2) In `app/` add a `.env` with your Firebase & Stripe keys (see `.env.example` below).
3) Run the app:
cd app
npm install
npm run dev
4) Deploy Functions (payments) — see section “Deploy backend”.

## Deploy backend (Stripe)
npm install -g firebase-tools
firebase login
firebase init # choose Hosting + Functions (Node 20)
cd functions
npm install
firebase functions:secrets:set STRIPE_SECRET_KEY
firebase functions:secrets:set STRIPE_WEBHOOK_SECRET
firebase deploy --only functions

Set `VITE_FUNCTIONS_URL` in `app/.env` to your Functions base URL.
Then:
cd ../app
npm run build
cd ..
firebase deploy --only hosting

## Firestore rules (minimal)
See `firestore.rules` in repo. Tighten before production.

## Assets
Put your existing logos/icons/photos into `app/public/assets/` (keep filenames).
