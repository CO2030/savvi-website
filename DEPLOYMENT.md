# SavviWell Deployment Guide - savviwell.com

## Quick Deployment to savviwell.com

This guide will help you deploy the SavviWell meal guide system to your custom domain savviwell.com.

### URLs After Deployment
- **Main signup page:** `https://savviwell.com/5-day-meals`
- **Meal guide access:** `https://savviwell.com/meal-guide?token=xxx`
- **Admin login:** `https://savviwell.com/admin/login`
- **Admin dashboard:** `https://savviwell.com/admin/dashboard`

## Environment Variables Required

### Database
```bash
DATABASE_URL=postgresql://username:password@host:port/database
PGHOST=your_postgres_host
PGPORT=5432
PGUSER=your_postgres_user
PGPASSWORD=your_postgres_password
PGDATABASE=your_database_name
```

### Email Service (Optional)
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### Google Apps Script Integration (Optional)
```bash
GOOGLE_SCRIPT_DEPLOYMENT_URL=https://script.google.com/macros/s/your_script_id/exec
```

### Session Management
```bash
SESSION_SECRET=your_secure_random_string_here
```

### Production Environment
```bash
NODE_ENV=production
PORT=5000
```

## Deployment Steps for savviwell.com

### 1. Replit Deployments (Recommended)
1. **Prepare for deployment:**
   - All code is already configured for production deployment
   - Email templates automatically use savviwell.com URLs in production
   - Static assets and routes are optimized

2. **Configure environment variables in Replit Secrets:**
   ```bash
   NODE_ENV=production
   DATABASE_URL=your_production_database_url
   SESSION_SECRET=your_secure_random_string
   SMTP_HOST=smtp.hostinger.com
   SMTP_USER=your_email@savviwell.com
   SMTP_PASS=your_email_password
   ```

3. **Deploy using the Replit deployment interface**
4. **Configure custom domain:**
   - In Replit Deployments, add custom domain: `savviwell.com`
   - Update DNS records to point to Replit's deployment URL
   - Configure SSL certificate (automatic with Replit)

5. **Test deployment:**
   - Visit `https://savviwell.com/5-day-meals`
   - Submit test form to verify email delivery works
   - Check admin access at `https://savviwell.com/admin/dashboard`

### 2. Alternative Deployment Platforms

### Vercel
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Configure environment variables in Vercel dashboard

### Railway
1. Connect your GitHub repository
2. Railway auto-detects the Node.js application
3. Configure environment variables in Railway dashboard
4. Railway provides PostgreSQL database addon

### Heroku
1. Create new Heroku app
2. Connect GitHub repository
3. Add PostgreSQL addon: `heroku addons:create heroku-postgresql:mini`
4. Configure environment variables in Heroku dashboard

## Database Setup

Run migrations after deployment:
```bash
npm run db:migrate
```

## Health Check

The application serves on port 5000 with health checks at:
- `/` - Main application redirect to lead magnet
- `/5-day-meals` - Lead magnet signup page
- `/meal-guide` - Secure meal guide access
- `/admin/dashboard` - Admin dashboard (categorized waitlist and contact entries)
- `/api/waitlist` - API health check

## URL Structure After Deployment

### Public Pages
- `https://savviwell.com/` - Redirects to lead magnet
- `https://savviwell.com/5-day-meals` - Main signup form
- `https://savviwell.com/meal-guide` - Access denied page (no token)
- `https://savviwell.com/meal-guide?token=xxx` - Authenticated access

### Protected Pages
- `https://savviwell.com/admin/login` - Admin login form
- `https://savviwell.com/admin/dashboard` - Admin dashboard (password: KalmarLisbon00025)

### API Endpoints
- `https://savviwell.com/api/waitlist` - Form submission
- `https://savviwell.com/api/verify-access` - Token verification

## Security Notes

- Admin dashboard is password protected (current: KalmarLisbon00025)
- Secure token-based access for meal guide content
- Database credentials should never be committed to repository
- Use strong, unique passwords for production
- SSL/TLS automatically enabled with custom domain deployment
- Email delivery uses secure SMTP with authentication

## Features Included in Deployment

### Lead Magnet System
- ✅ Instant PDF download on form submission
- ✅ Professional email delivery with meal guide content
- ✅ Secure token-based access to online version
- ✅ Social sharing functionality for viral growth

### Admin Dashboard
- ✅ Waitlist entries management
- ✅ Contact form submissions
- ✅ Data export capabilities
- ✅ Real-time statistics

### Security Features
- ✅ Token-based authentication for meal guide access
- ✅ Password-protected admin area
- ✅ Session management
- ✅ SQL injection protection

## Monitoring

Monitor these endpoints for application health:
- Database connection status
- Email service functionality
- API response times
- Error logs for debugging