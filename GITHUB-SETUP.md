# 🚀 GitHub Deployment Setup for Click2Leads

## Quick Start

### 1️⃣ Update Configuration
```bash
# Edit the setup script
nano setup-github-deployment.sh

# Change these values:
GITHUB_USERNAME="yourusername"  # Your GitHub username
VPS_HOST="your-vps-ip"         # Your VPS IP address
```

### 2️⃣ Run Setup Script
```bash
chmod +x setup-github-deployment.sh
./setup-github-deployment.sh
```

The script will:
1. Initialize Git repository
2. Create .env.example template
3. Guide you through GitHub repo creation
4. Push code to GitHub (WITHOUT .env files)
5. Generate SSH keys for deployment
6. Transfer .env files separately to VPS
7. Setup VPS for receiving deployments
8. Test the deployment pipeline

### 3️⃣ What Gets Transferred

**Via GitHub (Automatic):**
- ✅ All source code
- ✅ Frontend React files
- ✅ Backend Node.js files
- ✅ Configuration files (PM2, NGINX)
- ✅ Scripts and documentation
- ✅ Package.json files

**Via SCP (Manual, One-time):**
- 🔒 .env.production (with passwords)
- 🔒 .env (development)
- 🔒 Any other sensitive files

### 4️⃣ GitHub Secrets Required

Go to: `Settings → Secrets and variables → Actions`

Add these secrets:
```yaml
VPS_HOST: your.vps.ip.address
VPS_USER: deploy
VPS_PORT: 22
VPS_SSH_KEY: -----BEGIN OPENSSH PRIVATE KEY-----
            [your private key content]
            -----END OPENSSH PRIVATE KEY-----
```

### 5️⃣ How It Works

```mermaid
graph LR
    A[Local Code] -->|git push| B[GitHub]
    B -->|GitHub Actions| C[Build & Test]
    C -->|Deploy via SSH| D[VPS Server]
    E[.env files] -->|SCP Once| D
```

1. **You push code** → GitHub
2. **GitHub Actions** runs tests and builds
3. **Deployment** via SSH to VPS
4. **PM2** restarts services
5. **Site updates** automatically

### 6️⃣ Deployment Commands

**First Time Setup:**
```bash
# Run the complete setup
./setup-github-deployment.sh
```

**Future Deployments:**
```bash
# Just push to GitHub
git add .
git commit -m "Update features"
git push origin main
# Deployment happens automatically!
```

**Manual .env Update:**
```bash
# If you need to update .env on VPS
scp backend/.env.production deploy@your-vps:/var/www/click2leads/backend/
```

### 7️⃣ File Structure on VPS

```
/var/www/click2leads/
├── backend/
│   ├── server.js
│   ├── .env.production (manually transferred)
│   └── node_modules/ (installed on VPS)
├── frontend/
│   └── build/ (built by GitHub Actions)
├── nginx/
│   └── click2leads.conf
├── scripts/
│   ├── monitor-health.sh
│   └── backup-production.sh
└── ecosystem.config.js
```

### 8️⃣ Security Notes

- ✅ .env files NEVER go to GitHub
- ✅ Passwords stay on VPS only
- ✅ GitHub repo can be public (no secrets)
- ✅ SSH key authentication
- ✅ Automated but secure

### 9️⃣ Monitoring Deployment

1. **GitHub Actions:** 
   ```
   https://github.com/yourusername/click2leads/actions
   ```

2. **VPS Logs:**
   ```bash
   ssh deploy@your-vps
   pm2 logs click2leads-backend
   ```

3. **Health Check:**
   ```bash
   curl https://click2leads.co.uk/api/health
   ```

### 🎯 Complete Process Summary

1. **Setup (Once):**
   - Run `setup-github-deployment.sh`
   - Create GitHub repo (private recommended)
   - Add GitHub secrets
   - Transfer .env files to VPS

2. **Deploy (Anytime):**
   - Make changes locally
   - `git push origin main`
   - GitHub Actions deploys automatically

3. **Result:**
   - All features working on VPS
   - Sensitive data secure
   - Automatic deployments

---

**That's it! Your Click2Leads now deploys automatically while keeping sensitive files secure!** 🚀