# Server Setup Guide (Ubuntu VPS)

Follow these steps to prepare your newly purchased Ubuntu VPS to receive automated deployments via GitHub Actions.

## 1. SSH into your VPS

Open your terminal and log into your server:

```bash
ssh root@<YOUR_SERVER_IP>
```

> [!IMPORTANT]
> **Add Swap Space (Crucial for Free Tier Servers)**
> Free servers (like AWS EC2 Free Tier) only provide 1GB of RAM. The Next.js `npm run build` step inside Docker requires over 1.5GB of RAM and will completely crash a free server if you don't add "Swap" memory. Run this to add 2GB of virtual memory:
>
> ```bash
> sudo fallocate -l 2G /swapfile
> sudo chmod 600 /swapfile
> sudo mkswap /swapfile
> sudo swapon /swapfile
> echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
> ```

## 2. Install Docker & Docker Compose

Run the following commands to install the official Docker environment:

```bash
# Update package index
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg

# Add Docker's official GPG key
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Set up the repository
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

## 3. Generate an SSH Key for GitHub Actions

We need to generate an SSH key so GitHub Actions can securely deploy code directly to this server:

```bash
ssh-keygen -t rsa -b 4096 -C "github-actions" -f ~/.ssh/id_rsa_github_actions -N ""
```

Add the generated public key to your authorized keys so the server trusts it:

```bash
cat ~/.ssh/id_rsa_github_actions.pub >> ~/.ssh/authorized_keys
```

Copy the Private Key to your clipboard (you will need to paste this into GitHub shortly):

```bash
cat ~/.ssh/id_rsa_github_actions
```

## 4. Prepare the Application Directory

Create the folder where your app will live and do the initial clone so GitHub Actions can just pull into it later:

```bash
mkdir -p /opt/career-coach-app
cd /opt/career-coach-app
git clone https://github.com/AhmedNazem/AI-career-coach2.0 .
```

## 5. Configure GitHub Secrets

Go to your GitHub repository in your web browser: **Settings** -> **Secrets and variables** -> **Actions** -> **New repository secret**.

Add exactly these named secrets:

- `SERVER_IP`: The IP address of this VPS
- `SERVER_USER`: `root` (or `ubuntu` depending on the provider)
- `SERVER_SSH_KEY`: The massive private key block you copied from Step 3 (including the BEGIN and END lines).
- `REDIS_URL`: The Redis Cloud URL you got earlier.
- `DATABASE_URL`: Your production PostgreSQL URL.
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: From your `.env.local`
- `CLERK_SECRET_KEY`: From your `.env.local`
- _(Add any other secret keys from your `.env.local` that the app needs)_

## 6. Trigger Database Migrations (One-time only)

Before spinning up the app, let's make sure your Database has the right tables:

```bash
npm install
npx prisma generate
npx prisma db push
```

## 7. Trigger Deployment!

1. Commit the Docker and NGINX files we just created on your local computer.
2. Push them to the `main` branch:
   ```bash
   git add .
   git commit -m "feat: Add Docker and CI/CD Pipeline"
   git push origin main
   ```
3. Go to the **Actions** tab on your GitHub repository. You will see the pipeline automatically run, connect to your server, build the Docker images, and launch your App!
