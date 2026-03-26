# 🚀 AI Career Coach: Feature Recommendations & Expansion Plan

_(Updated to include SaaS Monetization & Real API Integrations)_

Based on your feedback, we have completely reshaped the roadmap to focus on **practical implementation**, **cost management**, and an **integrated Job Board**.

Here are the refined feature expansions, including how to actually build them step-by-step.

---

## 🏗️ 1. Mock Interview Center (SaaS & Human Options)

Since real-time AI Voice models are very expensive to run, we should split the Mock Interview feature into two profitable/manageable paths:

### **Option A: Paid AI Voice Interview (Premium SaaS Tier)**

The ultimate career coaching feature: a conversational, real-time voice AI interviewer. It is locked behind a paywall so you don't lose money on expensive API calls.

- **How it works:** Users buy "Interview Tokens" using real money. They spend a token to do a 15-minute mock interview with the AI.
- **Implementation Steps:**
  1.  **Payment API Integration:** Connect an Iraqi payment gateway (**ZainCash**, **FIB**, or **FastPay** APIs) to handle transactions.
  2.  **Database (Prisma):** Add `tokens Int @default(0)` to the `User` model. Update records when your backend receives a successful payment webhook.
  3.  **AI Voice Stack:** Combine **Deepgram** (Speech-to-Text), **ElevenLabs** (Text-to-Speech), and **Vercel AI SDK** to manage the real-time websocket conversation.

### **Option B: Manual Coach Scheduling (Free to run)**

Instead of AI, connect the user with a real human (you or other verified coaches) on the platform.

- **How it works:** Users browse available times and book a 30-minute Google Meet link directly through your app.
- **Implementation Steps:**
  1.  **Scheduling API:** Embed **Cal.com** or integrate the **Google Calendar API** directly into a Next.js page (`app/(main)/coaching/page.jsx`).
  2.  **Database:** Allow the `User` model to have a `role` of either `CANDIDATE` or `COACH`.

---

## 📊 2. "One-Click" Job Board & Kanban Tracker

Instead of users manually typing jobs they applied to, we fetch real jobs for them, let them apply, and track it automatically.

### **How we get the jobs:**

We will integrate a live **Job Search API** (e.g., **JSearch on RapidAPI** or **Jooble API**) so your platform is always filled with fresh Software Engineering, Marketing, etc., jobs in your target region or remotely.

### **How it works:**

1.  **The Job Feed (`/jobs`):** Users browse the fresh jobs pulled from the API.
2.  **AI Gap Analysis:** When a user clicks a job, your app instantly passes the Job Description + the User's Resume to **Gemini**. Gemini outputs a "Match Score (85%)" and tells them exactly what keywords to add to their resume.
3.  **Auto-Tracking:** The user clicks "Apply" (which takes them to LinkedIn/company site). Your app automatically creates a card in their personal **Kanban Tracker** (`/tracker`) moving the job to "Applied."

### **Implementation Steps:**

1.  **Database (Prisma):** Create a `JobApplication` model with `company`, `title`, and `status` (Wishlist, Applied, Interview, Offer, Rejected).
2.  **The Backend (Next.js Server Actions):** Create `actions/jobs.js` to securely fetch from JSearch without exposing API keys.
3.  **The UI (Kanban Drag & Drop):** Build the Tracker page using `@hello-pangea/dnd` or `dnd-kit` so users can beautifully drag jobs between columns.
4.  **Follow-up Reminders:** Use your existing **Inngest** setup to email the user 7 days after applying to remind them to follow up.

---

## 🗺️ 3. AI Career Roadmap & Learning Path

Users often know their dream role (e.g., "Senior React Developer") but need a path.

### **How it works:**

The user inputs their "Goal". Gemini analyzes their current Prisma profile skills and generates a 6-month visual roadmap with recommended YouTube courses or links.

### **Implementation Steps (Completed):**

1.  **UI:** Built using **`React Flow`** (`@xyflow/react`) for an interactive, draggable flowchart. Milestone nodes are custom components.
2.  **Backend:** Implemented in `actions/roadmap.js`. Gemini generates a structured JSON array of milestones based on user goals and industry trends.
3.  **Data Persistence:** Roadmaps are saved in the `Roadmap` Prisma model, ensuring users can return to their path anytime.

---

## 🔐 4. Standard AI & Server Action Patterns

To keep the application robust, all new features MUST follow these established patterns:

### **A. Standard API Response Pattern**
All Server Actions must return a consistent object structure:
```javascript
{
  success: true/false,
  data: resultData,    // Only if success is true
  error: "Error Message" // Only if success is false
}
```

### **B. Gemini Prompting & JSON Safety**
When requesting JSON from Gemini:
1.  **Explicit Prompting:** Requesting "ONLY RAW JSON" without markdown backticks.
2.  **Sanitization:** Use `response.replace(/```json|```/g, "").trim()` before parsing.
3.  **Validation:** Use **Zod** schema validation immediately after parsing to ensure result integrity.

### **C. Background Jobs (Inngest)**
For tasks that take > 10 seconds or are triggered by events (e.g., weekly reminders):
- Use `lib/inngest/client.js` to define events.
- Create functions in `app/api/inngest/route.js`.

---

## 🔍 5. SEO & Search Optimization

To ensure the product is discoverable, we follow these technical SEO patterns:

### **A. Global Metadata Strategy**
Configure the root `layout.jsx` with dynamic title templates and OpenGraph images:
```javascript
export const metadata = {
  title: { default: "Sensai", template: "%s | Sensai" },
  openGraph: { images: ["/logo.png"] },
};
```

### **B. Automated Indexing**
- **`app/sitemap.js`**: Generates a dynamic XML sitemap of all public-facing routes.
- **`app/robots.js`**: Instructs search engines on which paths to crawl (allowing all except `/api` and internal auth).

---

## 🌐 6. Deployment & Self-Hosting (Nginx)

For custom server deployments (VPS), we use a high-performance stack:

1.  **Process Management (PM2):** Keeps the Node.js process alive and handles reboots.
2.  **Reverse Proxy (Nginx):** Handles SSL (via Certbot), buffers requests, and serves static files from `.next/static`.
3.  **Security Headers:** Nginx adds `X-Frame-Options` and `X-Content-Type-Options` to protect users.

---

- If you want to start generating revenue early, we should build **Feature 1 (Paid AI Voice Interview + Payment API)**.
- If you want to maximize daily user engagement, we should build **Feature 2 (The internal Job Board + Drag & Drop Tracker)** first.
