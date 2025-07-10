# Admin Panel Setup Instructions

## Overview
The Click2Leads admin panel allows you to update website content without modifying code. Access it at: `https://click2leads.co.uk/admin`

## Default Credentials
- **Username:** admin
- **Password:** admin123
- **⚠️ IMPORTANT:** Change the password immediately after first login!

## Features
1. **Content Editor** - Edit text content across the website
2. **Password Management** - Change admin password

## How to Deploy the Admin Panel

### 1. Test Locally First
```bash
# Backend
cd backend
npm install
npm start

# Frontend (in new terminal)
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000/admin` to test the admin panel.

### 2. Deploy to Server

1. **Commit and push changes via GitHub Desktop**

2. **SSH into your server:**
```bash
ssh root@31.97.57.193
```

3. **Pull latest changes:**
```bash
cd /var/www/click2leads
git pull origin main
```

4. **Install backend dependencies:**
```bash
cd backend
npm install
```

5. **Restart services:**
```bash
pm2 restart all
# Or specifically:
pm2 restart backend
pm2 restart frontend
```

6. **Initialize database (first time only):**
The database will be created automatically when the backend starts.

## Using the Admin Panel

### Accessing the Panel
1. Go to `https://click2leads.co.uk/admin`
2. Login with your credentials

### Editing Content
1. Click on "Content Editor" tab
2. Expand the section you want to edit (Hero, About, Services)
3. Modify the text fields
4. Click "Save Changes" to update the website

### Content Sections Available:
- **Hero Section**
  - Main title
  - Subtitle
  - Statistics (spending and leads)
  - Button texts
  
- **About Section**
  - Title
  - Description
  
- **Services**
  - Service titles and descriptions

### Changing Password
1. Click on "Settings" tab
2. Enter current password
3. Enter and confirm new password
4. Click "Change Password"

## Troubleshooting

### Can't Login?
1. Check if backend is running: `pm2 status`
2. Check backend logs: `pm2 logs backend`
3. Verify database exists: The SQLite database should be at `/var/www/click2leads/backend/click2leads.db`

### Changes Not Appearing?
1. Make sure you clicked "Save Changes"
2. Clear browser cache or try incognito mode
3. Check if frontend is fetching latest content
4. Content is cached for 5 minutes - wait or restart frontend

### Reset Admin Password
If you're locked out, SSH into server and:
```bash
cd /var/www/click2leads/backend
# Delete the database (this will reset everything)
rm click2leads.db
# Restart backend to recreate with default password
pm2 restart backend
```

## Security Notes
1. The admin panel is protected by JWT authentication
2. Tokens expire after 24 hours
3. Always use HTTPS
4. Change default password immediately
5. Don't share admin credentials

## API Endpoints
- `POST /api/admin/login` - Admin login
- `POST /api/admin/change-password` - Change password (protected)
- `GET /api/content/:section?` - Get content (public)
- `POST /api/content` - Update content (protected)

## Next Steps
1. Login and change the default password
2. Update your website content
3. Consider adding more sections as needed
4. Monitor the logs for any issues