# Professional Deployment Architecture Plan

This plan details a highly scalable, enterprise-grade architecture that moves beyond basic serverless constraints to fulfill your requirement of separating the Database, Application (Website + API), and Infrastructure layers, while adding robust protection, load balancing, and caching.

## 1. Infrastructure Architecture

The deployment is split into **5 distinct layers**:

### A. Protection Layer & CDN (Cloudflare or AWS CloudFront)
*   **Role:** Primary ingress point.
*   **Features:** Web Application Firewall (WAF) to block malicious requests, zero-day protection, DDoS mitigation, and a CDN to serve static assets (images, CSS, JS) from edge servers worldwide instantly.

### B. Load Balancer (NGINX or AWS ALB)
*   **Role:** Traffic distributor.
*   **Features:** Sits behind the Protection Layer. Terminates SSL and distributes incoming requests across multiple Next.js Application Servers in a round-robin or least-connected fashion. Ensures high availability (if one server goes down, traffic routes to the other).

### C. Website & API Servers (Next.js Node Servers)
*   **Role:** The core muscle of the app.
*   **Features:** `2+` Dedicated Servers or VPS instances (e.g., AWS EC2, DigitalOcean Droplets, or Hetzner). We will compile Next.js in `standalone` mode and run it inside Docker containers. It handles all React Server Components (Website) and Server Actions (API).

### D. Caching Layer (Redis)
*   **Role:** High-speed in-memory data store.
*   **Features:** A dedicated Redis server used for Next.js Cache (replacing the default file-system cache), Database query caching, and Rate Limiting for auth/AI generation endpoints.

### E. Database Server (PostgreSQL + PgBouncer)
*   **Role:** Secure, persistent data storage.
*   **Features:** A dedicated PostgreSQL server (or Managed DB like AWS RDS/Neon). It is **only accessible via a Private Network (VPC)**. It uses `PgBouncer` for connection pooling to ensure the Next.js servers don't exhaust the database connections under high load.

---

## 2. Proposed Implementation Steps

### Step 1: Prepare Next.js for VPS / Docker
#### `next.config.js` Update
- Enable `output: 'standalone'` to drastically reduce the size of the production build.
- Configure a custom caching handler to use Redis instead of the local filesystem.

#### `Dockerfile` & `.dockerignore`
- Create an optimized, multi-stage Dockerfile to build and run the Next.js standalone server securely using a non-root node user.

#### `docker-compose.yml`
- Create a compose file to easily spin up the application cluster locally or on a single robust VPS environment.

### Step 2: NGINX Configuration (Load Balancer & Reverse Proxy)
#### `nginx/nginx.conf`
- Create a production-ready NGINX configuration that routes traffic to Next.js instances, compresses payloads (Gzip/Brotli), sets security headers, and forwards real IP headers.

### Step 3: Caching & Rate Limiting Integration
- Update Next.js API Routes and Server Actions to utilize Redis for rate limiting (via Upstash or `ioredis`).

### Step 4: CI/CD Pipeline Secure Deployment
#### `.github/workflows/deploy.yml`
- Set up a GitHub Actions pipeline that securely builds the Docker image and deploys it to your production servers via SSH or pushing to an Elastic Container Registry (ECR) whenever you push to the `main` branch.

---

## 3. Verification Plan

### Automated Tests
- Run `npm run build` after configuring standalone mode to ensure the output is properly minimized into the `.next/standalone` directory.
- Test the Docker container locally using `docker build -t career-coach-app .` and `docker run -p 3000:3000 career-coach-app`.

### Manual Verification
- Simulate a high-traffic scenario locally by spinning up NGINX and 2 Next.js containers in `docker-compose`.
- Ping the Localhost Load balancer repeatedly and check logs to verify traffic is alternating between Next.js nodes.
- Confirm that database queries are correctly utilizing the connection pool in PostgreSQL.
