# 🏗️ AI Career Coach: Architecture & Best Practices

This document outlines the file structure, architecture, and strict coding constraints that must be followed while developing the AI Career Coach platform. Adhering to these standards ensures the codebase remains secure, scalable, and maintainable.

---

## 📂 1. Core File Structure

The project uses the **Next.js App Router** (`app/` directory). Here is how the files are organized:

```text
career-coach/
├── actions/              # 🔒 Server Actions (Database & AI logic)
│   ├── dashboard.js
│   ├── interview.js
│   └── ...
├── app/                  # 🌐 Next.js App Router (Pages & Layouts)
│   ├── (auth)/           # Authentication pages (Clerk SignIn/SignUp)
│   ├── (main)/           # Protected application routes (Dashboard, Resume, Tracker)
│   ├── api/              # Route Handlers (Webhooks, Inngest endpoints)
│   ├── layout.jsx        # Root layout (Providers, Headers)
│   └── page.jsx          # Public landing page
├── components/           # 🧩 React Components
│   ├── ui/               # Shadcn UI reusable generic components (Buttons, Inputs)
│   └── ...               # Custom layout components (Header, HeroSection)
├── lib/                  # 🛠️ Utility Functions & Configs
│   ├── prisma.js         # Prisma client initialization (Singleton pattern)
│   ├── utils.js          # Tailwind `cn` merger and helpers
│   └── ...
├── prisma/               # 🗄️ Database
│   └── schema.prisma     # Prisma database schema definition
├── data/                 # 📄 Static Content (FAQs, Industry lists, mock data)
└── public/               # 🖼️ Static assets (Images, Icons)
```

---

## ⚖️ 2. Architecture & Security Constraints

### A. Next.js Server Components vs. Client Components

1.  **Server by Default**: All pages and components inside the `app/` folder should be **Server Components** by default for maximum performance and SEO.
2.  **`"use client"` Carefully**: Only add `"use client"` at the very top of a file if the component absolutely requires:
    - React State (`useState`, `useReducer`) or Lifecycle (`useEffect`).
    - Browser native APIs (e.g., WebRTC for microphone access, `window`, `localStorage`).
    - Interactivity mapping (e.g., `onClick`, `onChange`).
3.  **No Leaks**: _Never_ import a file containing `"use server"` or sensitive database code directly into a `"use client"` component, unless it's explicitly calling a Server Action.

### B. Data Fetching & Server Actions (`actions/`)

1.  **No APIs for internal logic**: Prefer Next.js **Server Actions** (`"use server"`) over traditional `/api` routes when fetching/mutating data from your own UI.
2.  **Strict Security / Auth**: Every single server action _must_ check for authentication before executing any logic:

    ```javascript
    import { auth } from "@clerk/nextjs/server";

    export async function fetchUserJobs() {
      const { userId } = await auth();
      if (!userId) throw new Error("Unauthorized");
      // Proceed with logic...
    }
    ```

3.  **Error Handling**: Wrap all server actions in `try/catch` blocks. Return standardized, serializable objects to the client (e.g., `{ success: true, data: ... }` or `{ success: false, error: "Message" }`).

### C. Database Standards (Prisma)

1.  **Schema First**: Always update `prisma/schema.prisma` first when proposing a new feature.
2.  **Clerk IDs**: Always map the Next.js/Clerk ID (`clerkUserId`) to the internal Prisma `User.id`. When querying for relational data, usually query against your internal `User.id`.
3.  **Generation**: Run `npx prisma generate` after _every_ change to the schema. Run `npx prisma db push` (or `migrate dev` for production) to sync the PostgreSQL database.

### D. AI Integration (Gemini / APIs)

1.  **Secrets**: Never expose `GEMINI_API_KEY` or any payment API keys to the frontend. All AI generation must happen purely in `actions/`.
2.  **JSON Validation**: When asking Gemini for structured data (like Interview Questions or Roadmaps), the prompt must explicitly demand `JSON`. You must strip markdown block syntax (e.g., `\`\`\`json ... \`\`\``) from the AI response before parsing it via `JSON.parse()`.
3.  **Timeouts/Limits**: AI APIs can be slow. Ensure features have loading states (like `<Spinner />` or Skeletons) on the frontend so the user doesn't think the app is broken.

### E. Styling & UI

1.  **Tailwind CSS**: Use Tailwind utility classes for all styling. Avoid creating custom `.css` rules unless completely necessary.
2.  **Shadcn UI**: Rely heavily on the `components/ui` library. If a new generic element is needed (like a Dialog, Select, or Slider), install it via the `shadcn` CLI rather than building from scratch.
3.  **Responsive Design**: All features must naturally degrade and scale beautifully down to mobile screens (ensure use of `md:`, `lg:` tailwind modifiers).

### F. SaaS / Payments (When Built)

1.  **Never trust the client**: Only issue "Tokens" or "Premium access" to a user when your backend Server Action or a secure `/api/webhook` verifies a successful payment payload from the payment provider (ZainCash, FIB, Stripe).

## 🚀 3. Production Deployment & Security Standards

### A. Environment & Infrastructure
1.  **Infrastructure**: Vercel is the primary deployment platform. Use `Neon` for PostgreSQL to handle serverless scaling.
2.  **CI/CD**: All changes must pass through a Pull Request. Automated builds in Vercel must succeed before merging.
3.  **Environment Variables**: Never hardcode secrets. Use Vercel's Environment Variables for production keys (Clerk, Gemini, Stripe, Deepgram).

### B. Scalability & Performance
1.  **Caching**: Use Next.js `unstable_cache` or `revalidatePath` for data that doesn't change frequently.
2.  **Asset Optimization**: Use `next/image` for all images to ensure automatic resizing and WebP conversion.
3.  **Streaming**: Implement React `Suspense` with Skeletons for AI-generated content to improve perceived performance.

### C. Security Hardening
1.  **Rate Limiting**: Critical endpoints (AI generation, Auth) must be protected by rate limiting (e.g., Upstash Redis).
2.  **Input Sanitization**: All user inputs must be validated using **Zod** schemas before processing.
3.  **CORS & CSRF**: Next.js Server Actions automatically handle CSRF, but public API routes must explicitly define allowed origins.

---

## 🛠️ 4. Maintenance & Monitoring
1.  **Error Tracking**: Integrate **Sentry** to monitor production crashes and performance bottlenecks.
2.  **Logging**: Use **Logtail** or Vercel Logs to track Server Action execution and AI latency.
3.  **Database Backups**: Enable auto-backups in Neon/Supabase to prevent data loss.
---

## 🔍 5. SEO & Search Integrity Standards

### A. Mandatory Metadata
1.  **Every Page Layout**: Every public `page.jsx` or layout must export a `metadata` object or `generateMetadata` function.
2.  **Semantic Titles**: Titles should be < 60 characters and include primary keywords (e.g., "AI Career Roadmap | Sensai").
3.  **Descriptive Descriptions**: Descriptions should be < 160 characters and provide a clear value proposition.

### B. Social Sharing (OpenGraph & Twitter)
1.  **Global OG**: The root `layout.jsx` must define default `openGraph` and `twitter` card properties.
2.  **Feature Images**: Use dynamic OG images for features like `Roadmaps` or `Job Reports` whenever possible.

### C. Technical SEO
1.  **Hydration Awareness**: Use `suppressHydrationWarning` on `html` tags carefully, but ensure `next/font` is used to prevent layout shifts (CLS).
2.  **Sitemaps & Robots**: Always maintain `app/sitemap.js` and `app/robots.js` to ensure search engines can index the site efficiently.
3.  **Canonical URLs**: Use the `metadata.alternates.canonical` property to prevent duplicate content issues.
