# TimeTravel Agency

> A premium, immersive single-page marketing website for a fictional luxury time travel agency. Built with Next.js 16, React 19, Framer Motion, and Tailwind CSS.

---

## Table of Contents

- [Overview](#overview)
- [Live Features](#live-features)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Components Breakdown](#components-breakdown)
- [API Routes](#api-routes)
- [Design System](#design-system)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [License](#license)

---

## Overview

TimeTravel Agency is a high-fidelity, fully animated marketing mockup for a luxury temporal tourism company. The site showcases three fictional destinations -- **Paris 1889**, the **Cretaceous Period (65M years ago)**, and **Renaissance Florence 1504** -- through cinematic video backgrounds, parallax effects, 3D tilt cards, and an AI-powered concierge chatbot named **Chronos**.

The project demonstrates advanced front-end techniques including:

- Full-screen video hero with crossfade transitions
- Scroll-driven parallax and reveal animations
- Glassmorphism UI with a dark navy & gold design language
- AI chatbot integration via Mistral API
- Dynamic booking modal with real-time price calculation
- Webhook-based form submission (Make.com integration)
- Media storage via Vercel Blob

---

## Live Features

### Hero Section
- Three looping background videos hosted on Vercel Blob Storage with automatic crossfade transitions (8s display, 1.5s fade)
- Scroll-driven parallax displacement on the video layer
- Floating particle system with randomized drift animations
- Decorative orbiting ring elements with continuous CSS rotation
- Animated badge, title (with gold gradient text), subtitle, and dual CTA buttons
- Scroll indicator with bouncing dot animation

### Navigation Header
- Fixed sticky header with glass-morphism effect on scroll
- Smooth anchor-link navigation (Home, Destinations, About)
- Mobile-responsive hamburger menu with slide-down animation
- "Book Now" CTA button integrated with the booking system

### About the Agency Section
- Animated counters (500+ Journeys, 100% Safe Returns, 4.5B Years Range) triggered on scroll intersection
- Full-width image with floating glassmorphism stat overlays
- Three feature highlights with icon badges (Unmatched Safety, Expert Guides, Pure Luxury)
- Staggered scroll-reveal animations via Framer Motion

### Featured Destinations
- Three destination cards: Paris 1889, Cretaceous Period, Florence 1504
- 3D mouse-tracking tilt effect on each card using `perspective()` and `rotateX/Y`
- Hover-triggered image zoom with gradient overlays
- Feature tag pills (Culture, Architecture, Gastronomy, etc.)
- "Learn More" buttons that open the booking modal with the destination pre-selected
- Scroll-reveal with staggered delay per card

### AI Chatbot Widget (Chronos)
- Floating chat bubble in the bottom-right corner with unread notification dot
- Spring-animated chat window with glassmorphism backdrop
- Full conversation interface with user/assistant message bubbles, timestamps, and delivery status indicators
- Typing indicator with animated bouncing dots
- Initial quick-reply suggestions and contextual follow-up suggestions parsed from AI responses
- Session-based chat history persistence (sessionStorage)
- Error handling with inline retry button
- Tooltip teaser that appears after 10 seconds if the chat hasn't been opened
- Character count limit (500 chars) with visual indicator
- Backend powered by Mistral AI (`mistral-small-latest` model) with an elaborate French-language system prompt

### Booking Modal
- Full-screen overlay with blur backdrop
- Multi-field reservation form: Full Name, Email, Destination (select), Departure/Return dates, Number of Travelers (1-4), Special Requests
- Dynamic real-time price calculator with animated counter (price = daily rate x days x passengers)
- Client-side validation with per-field error messages
- Form submission via webhook (Make.com endpoint)
- Success state with confirmation summary and animated check icon
- Spring-based enter/exit animations

### Footer
- Three-column layout: About, Quick Links, Contact & Newsletter
- Social media icon placeholders with hover spring animations
- Email newsletter subscription form
- Legal disclaimer referencing the fictional "Temporal Displacement Act of 2024"

---

## Tech Stack

| Category | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **UI Library** | React 19.2 |
| **Language** | TypeScript 5.7 |
| **Styling** | Tailwind CSS 3.4 + custom design tokens |
| **Animations** | Framer Motion 11 |
| **UI Components** | shadcn/ui (Radix UI primitives) |
| **Icons** | Lucide React |
| **Fonts** | Playfair Display (serif headings) + Inter (sans body) via `next/font/google` |
| **AI Backend** | Mistral AI API (`mistral-small-latest`) |
| **Media Storage** | Vercel Blob Storage |
| **Form Webhook** | Make.com (Integromat) |
| **Package Manager** | pnpm |

---

## Project Architecture

```
.
├── app/
│   ├── api/
│   │   ├── chat/route.ts              # Mistral AI chatbot API endpoint
│   │   └── upload-images/route.ts     # Vercel Blob upload utility
│   ├── globals.css                     # Design tokens, utilities, animations
│   ├── layout.tsx                      # Root layout with fonts & metadata
│   └── page.tsx                        # Home page composition
├── components/
│   ├── agency-section.tsx              # About section with counters & features
│   ├── booking-context.tsx             # React Context for booking modal state
│   ├── booking-modal.tsx               # Reservation form with price calculator
│   ├── chatbot-widget.tsx              # AI chatbot (Chronos) interface
│   ├── destinations-section.tsx        # Destination cards with 3D tilt
│   ├── footer.tsx                      # Footer with newsletter & links
│   ├── header.tsx                      # Sticky nav with glassmorphism
│   ├── hero.tsx                        # Video hero with parallax & particles
│   ├── particles.tsx                   # Floating particle system
│   ├── theme-provider.tsx              # next-themes provider wrapper
│   └── ui/                             # shadcn/ui component library
├── hooks/
│   ├── use-mobile.tsx                  # Mobile breakpoint detection
│   ├── use-scroll-reveal.ts           # IntersectionObserver scroll animations
│   └── use-toast.ts                   # Toast notification hook
├── lib/
│   └── utils.ts                        # cn() class merge utility
├── scripts/
│   ├── trigger-upload.js              # Upload trigger script
│   └── upload-images.js               # Batch image upload to Vercel Blob
├── styles/
│   └── globals.css                     # Additional global styles
├── next.config.mjs                     # Next.js config (remote images, TS)
├── tailwind.config.ts                  # Tailwind theme extensions
└── package.json
```

---

## Components Breakdown

### `Hero` (`components/hero.tsx`)
Manages a video carousel with three Vercel Blob-hosted MP4 files. Uses `useScroll` and `useTransform` from Framer Motion for parallax. The crossfade logic uses a timer-based state machine cycling through `activeIndex` and `nextIndex` with opacity transitions.

### `AgencySection` (`components/agency-section.tsx`)
Displays animated counters using a custom `AnimatedCounter` component that interpolates values with cubic easing over 2 seconds. Three feature cards with `ShieldCheck`, `Award`, and `Gem` icons animate in with staggered delays.

### `DestinationsSection` (`components/destinations-section.tsx`)
Wraps each destination card in a `TiltCard` component that tracks mouse position and applies `perspective(1000px) rotateX/Y` transforms in real-time. Uses a custom `useScrollReveal` hook for intersection-based visibility toggling.

### `ChatbotWidget` (`components/chatbot-widget.tsx`)
A self-contained chat interface that communicates with `/api/chat`. Parses `[SUGGESTIONS]...[/SUGGESTIONS]` tags from the AI response to extract contextual quick-reply buttons. Persists conversation history in `sessionStorage` and shows a proactive tooltip teaser after 10 seconds of inactivity.

### `BookingModal` (`components/booking-modal.tsx`)
A multi-step form wrapped in `AnimatePresence` for enter/exit animations. Computes pricing dynamically: `totalPrice = pricePerDay * days * passengers`. Uses an `AnimatedPrice` component with `requestAnimationFrame` for smooth counter transitions. Submits data to a Make.com webhook endpoint.

### `BookingContext` (`components/booking-context.tsx`)
A React Context provider that manages the booking modal's open/close state and the pre-selected destination. Exposed via `useBooking()` hook, consumed by the Header, Destinations, and BookingModal components.

---

## API Routes

### `POST /api/chat`
- **Purpose**: Proxies user messages to the Mistral AI API
- **Model**: `mistral-small-latest`
- **System Prompt**: An elaborate French-language persona prompt for "Chronos", a luxury temporal concierge. Includes detailed knowledge of three destinations, pricing, historical anecdotes, and strict behavioral rules (refuses off-topic questions, maintains immersive vocabulary)
- **Response**: Returns `{ content: string }` with the AI's response (may contain `[SUGGESTIONS]` tags)
- **Error Handling**: Returns themed error messages ("perturbation temporelle") instead of generic errors

### `GET /api/upload-images`
- **Purpose**: Utility endpoint to batch-upload local images from `public/images/` to Vercel Blob Storage
- **Dependencies**: `@vercel/blob`

---

## Design System

### Color Palette
| Token | HSL Value | Usage |
|---|---|---|
| `--background` | `228 40% 7%` | Deep navy page background |
| `--foreground` | `45 29% 97%` | Light cream text |
| `--primary` | `43 56% 52%` | Gold accent (buttons, highlights, icons) |
| `--primary-foreground` | `228 40% 7%` | Dark text on gold backgrounds |
| `--secondary` | `228 25% 15%` | Elevated surface color |
| `--muted-foreground` | `228 10% 55%` | Subdued text |
| `--border` | `228 20% 18%` | Subtle border lines |

### Typography
- **Headings**: Playfair Display (serif), bold, tracking-tight
- **Body**: Inter (sans-serif), leading-relaxed
- **Gold Gradient Text**: Custom `.text-gradient-gold` class with animated `background-size` shift

### Custom Utilities
- `.glass` / `.glass-strong` -- Glassmorphism with backdrop blur
- `.glow-gold` / `.glow-gold-hover` -- Gold box-shadow glow effects
- `.section-gradient-1` / `.section-gradient-2` -- Subtle vertical background gradients
- `.chat-scrollbar` -- Thin gold-tinted scrollbar for the chat widget

### Accessibility
- `prefers-reduced-motion` media query respected globally
- Framer Motion's `useReducedMotion()` hook used in all animated components
- ARIA labels on chat widget (`role="dialog"`, `role="log"`, `aria-live="polite"`)
- Semantic HTML structure with `<section>`, `<article>`, `<nav>`, `<header>`, `<footer>`

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `MISTRAL_API_KEY` | Yes | API key for Mistral AI (powers the Chronos chatbot) |
| `BLOB_READ_WRITE_TOKEN` | No | Vercel Blob token (only needed for the image upload utility) |

---

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd timetravel-agency

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Add your MISTRAL_API_KEY to .env.local

# Start development server (Turbopack)
pnpm dev
```

The app will be available at `http://localhost:3000`.

### Build for Production

```bash
pnpm build
pnpm start
```

---

## Deployment

This project is optimized for deployment on **Vercel**:

1. Push the repository to GitHub
2. Import the project on [vercel.com](https://vercel.com)
3. Add the `MISTRAL_API_KEY` environment variable in the Vercel dashboard
4. Deploy -- Vercel Blob Storage is automatically available for media assets

The site uses Vercel Blob Storage for all media (hero videos, destination images, agency photo), so no local `public/images/` directory is required in production.

---

## License

This project is a fictional mockup created for demonstration purposes. All historical references are used creatively. TimeTravel Agency is not a real company. Time travel is not yet available (as far as we know).
