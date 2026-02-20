<div align="center">

# LUNAR

### *Frontier Space-Science AI — Mission Control for the Cosmos*

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%2B%20Firestore-orange?style=flat-square&logo=firebase)](https://firebase.google.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Gemini 2.0](https://img.shields.io/badge/Gemini-2.0%20Flash-4285F4?style=flat-square&logo=google)](https://openrouter.ai)
[![Deployed on Vercel](https://img.shields.io/badge/Vercel-Live-000?style=flat-square&logo=vercel)](https://your-deployment-url.vercel.app)

---

<!-- Replace with an actual screenshot of the Mission Control UI -->
<!-- ![LUNAR Mission Control](./public/screenshot.png) -->

</div>

## Overview

**LUNAR** is a real-time Space Science AI chatbot that simulates a mission-control experience. Ask it about orbital mechanics, stellar evolution, dark matter, or any topic across the cosmos — LUNAR responds with scientific precision, real equations, and references to actual missions and datasets (JWST, Cassini, LIGO, Kepler, etc.).

Built as a performant, cinematic single-page app with streaming responses, persistent chat history, and a fully immersive space-themed UI.

## Tech Stack

| Layer         | Technology                                                  |
| ------------- | ----------------------------------------------------------- |
| **Framework** | Next.js 16 (App Router, Turbopack, Edge Runtime)            |
| **Frontend**  | React 19, TypeScript 5, Tailwind CSS v4, Framer Motion 12   |
| **Auth**      | Firebase Authentication (Google + Anonymous sign-in)        |
| **Database**  | Cloud Firestore (real-time chat persistence per user)       |
| **AI Model**  | Google Gemini 2.0 Flash via OpenRouter (streaming SSE)      |
| **Hosting**   | Vercel                                                      |

## Features

- **Streaming AI Responses** — Server-Sent Events (SSE) for real-time token-by-token output
- **Persistent Chat History** — Firestore when signed in, localStorage fallback when signed out
- **Google + Guest Authentication** — One-click Google sign-in or anonymous guest access with account linking
- **Automatic Data Migration** — localStorage chats seamlessly migrate to Firestore on first sign-in
- **Cinematic Space UI** — Interactive particle background, glass-morphism cards, ambient BGM toggle
- **Digital World Clock** — Live UTC clock in the header for a mission-control feel
- **Ambient Audio Toggle** — Space-themed background music with volume control
- **Responsive Design** — Fully adaptive from mobile to ultrawide
- **Accessible** — Reduced-motion support via `useReducedMotion`, ARIA labels, keyboard navigation

## Getting Started

### Prerequisites

- Node.js 18+
- A [Firebase project](https://console.firebase.google.com) with **Authentication** (Google + Anonymous providers enabled) and **Firestore** database
- An [OpenRouter](https://openrouter.ai) API key

### 1. Clone & Install

```bash
git clone https://github.com/ArtPlayerYT/lunar-app.git
cd lunar-app
npm install
```

### 2. Configure Environment

Copy the example env file and fill in your keys:

```bash
cp .env.example .env.local
```

Required variables (see `.env.example`):

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
OPENROUTER_API_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Set Firestore Security Rules

In the Firebase Console → Firestore → Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/chats/{chatId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to launch Mission Control.

## Project Structure

```
src/
├── app/
│   ├── api/chat/route.ts      # Edge Runtime — streams Gemini via OpenRouter
│   ├── lunarai/page.tsx        # Chat interface page
│   ├── layout.tsx              # Root layout (AuthProvider + MotionProvider)
│   └── page.tsx                # Landing page
├── components/
│   ├── chat-interface.tsx      # Full chat UI, sidebar, history, dual-mode save
│   ├── hero-section.tsx        # Landing hero with CTA
│   ├── layout/
│   │   ├── header.tsx          # Nav, digital clock, audio toggle
│   │   └── footer.tsx          # Footer with links
│   ├── sections/
│   │   ├── about-section.tsx   # About / credits
│   │   └── features-section.tsx
│   └── ui/                     # Reusable UI primitives
│       ├── atmosphere.tsx      # Particle background
│       ├── glass-card.tsx
│       ├── interactive-background.tsx
│       ├── lunar-loader.tsx
│       ├── lunar-logo.tsx
│       └── motion-provider.tsx # LazyMotion wrapper
└── lib/
    ├── auth-context.tsx        # Firebase Auth context + hooks
    ├── firebase.ts             # Firebase client SDK init (env-driven)
    ├── firestore.ts            # Firestore CRUD helpers
    └── utils.ts                # cn() utility
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Add all environment variables from `.env.example` to the Vercel project settings
4. Deploy — Vercel auto-detects Next.js

**Live Demo:** [*your-deployment-url.vercel.app*](https://lunar-vert.vercel.app/)

## License

This project is private. All rights reserved.

---

<div align="center">
  <sub>Built with precision by <a href="https://github.com/ArtPlayerYT">ArtPlayerYT</a> — exploring the cosmos, one query at a time.</sub>
</div>
