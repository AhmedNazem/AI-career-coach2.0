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

### **Implementation Steps:**

1.  **UI:** Use **`React Flow`** (`@xyflow/react`) to build an interactive, draggable visual flowchart for the roadmap.
2.  **Backend:** Write a new server action in `actions/roadmap.js` that calls Gemini to generate a structured JSON array of "milestones" and saves it to a new `Roadmap` Prisma model.

---

## 🌐 4. Public Portfolio Builder (1-Click Website)

A resume is great, but a live personal website stands out to recruiters.

### **How it works:**

With one click, your app takes the User's Bio, Experience, Skills, and AI-generated Resume, and publishes a beautiful webpage (e.g., `career-coach.com/p/john-doe`).

### **Implementation Steps:**

1.  **Next.js Dynamic Routing:** Create a new folder at `app/[username]/page.jsx` for public, SEO-friendly portfolio rendering.
2.  **Database:** Add a `slug String @unique` to the `User` model to reserve their custom URL.
3.  **Image Hosting:** Add **UploadThing** or **Vercel Blob** so they can upload a professional headshot without bloating the database.

---

### 💡 Where should we start?

- If you want to start generating revenue early, we should build **Feature 1 (Paid AI Voice Interview + Payment API)**.
- If you want to maximize daily user engagement, we should build **Feature 2 (The internal Job Board + Drag & Drop Tracker)** first.
