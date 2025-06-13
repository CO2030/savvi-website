# SavviWell Deployment Guide

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

## Deployment Platforms

### Replit Deployments
1. Connect your GitHub repository to Replit
2. Configure environment variables in Replit Secrets
3. Deploy using the Replit deployment interface

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
- `/` - Main application
- `/api/waitlist` - API health check

## Security Notes

- Admin dashboard is password protected
- Database credentials should never be committed to repository
- Use strong, unique passwords for production
- Enable SSL/TLS in production environment

## Monitoring

Monitor these endpoints for application health:
- Database connection status
- Email service functionality
- API response times
- Error logs for debugging