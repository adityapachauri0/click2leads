# Deploying Click2leads to Hostinger

## Option 1: VPS Hosting (Recommended for Next.js)

### Prerequisites
- Hostinger VPS plan
- SSH access to your server
- Node.js 18+ installed on server

### Steps:

1. **Prepare your local project**
   ```bash
   npm run build
   ```

2. **Connect to your VPS via SSH**
   ```bash
   ssh root@your-server-ip
   ```

3. **Install Node.js on VPS (if not installed)**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

4. **Install PM2 (process manager)**
   ```bash
   npm install -g pm2
   ```

5. **Upload your project**
   - Use FileZilla or SCP to upload these files/folders:
     - `.next/` (build output)
     - `public/`
     - `package.json`
     - `package-lock.json`
     - `next.config.js`
   
   Example with SCP:
   ```bash
   scp -r .next public package*.json next.config.js root@your-server-ip:/var/www/click2leads/
   ```

6. **Install dependencies on server**
   ```bash
   cd /var/www/click2leads
   npm ci --production
   ```

7. **Start the application with PM2**
   ```bash
   pm2 start npm --name "click2leads" -- start
   pm2 save
   pm2 startup
   ```

8. **Configure Nginx as reverse proxy**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Option 2: Static Export (Limited functionality)

If you have shared hosting only, you can export as static HTML:

1. **Modify next.config.js**
   ```javascript
   const nextConfig = {
     output: 'export',
     // ... other config
   }
   ```

2. **Build static export**
   ```bash
   npm run build
   ```

3. **Upload the `out/` folder contents to public_html**

**Note:** Static export has limitations:
- No server-side features
- No API routes
- No dynamic routes
- No image optimization

## Important Notes

1. **Environment Variables**: Create `.env.production` if needed
2. **Domain Setup**: Configure your domain in Hostinger control panel
3. **SSL Certificate**: Enable free SSL through Hostinger
4. **Performance**: Consider enabling Cloudflare CDN

## Post-Deployment Checklist

- [ ] Test all pages load correctly
- [ ] Check mobile responsiveness
- [ ] Verify contact form (needs backend implementation)
- [ ] Enable SSL certificate
- [ ] Set up monitoring (e.g., UptimeRobot)
- [ ] Configure backups

## Troubleshooting

- If site shows 502 error: Check if Node.js app is running
- If styles missing: Ensure `.next/static` folder was uploaded
- If 3D animations lag: Check server resources, consider upgrading VPS