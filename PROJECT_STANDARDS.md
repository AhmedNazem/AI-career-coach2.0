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

### G. Senior Full-Stack Scalability & Clean Code

1.  **Maximum File Size Constraint**: No UI file (`page.jsx`, `component.jsx`) should exceed **150 lines of code**. If a file grows larger than this, its internal sections _must_ be broken down into smaller, focused child components.
2.  **The "Rule of Two" for Reusability**: If UI code, a layout pattern, or a utility function is going to be used **twice**, it must immediately be extracted into a reusable, generic component (inside `components/`) or a helper function (inside `lib/`).
3.  **Single Responsibility Principle (SRP)**: Each component should do _one_ thing. Separate large pages into a Data Fetching wrapper pattern and a pure UI presentation component.
4.  **Scalable Architecture**: Keep the global `components/` folder for generic, app-wide UI (like Buttons or Cards). Use feature-specific `_components/` folders inside route directories (e.g., `app/(main)/jobs/_components/`) for UI pieces that only apply to one specific feature.
