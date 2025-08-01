# SavviWell Migration Guide

## Current Data Status
- **Total Entries**: 6 waitlist signups
- **Lead Magnet Signups**: 2 (5-day-meals)
- **Regular Waitlist**: 4 (standard signups)
- **Database**: PostgreSQL with full schema
- **Google Sheets**: Integration code ready, needs deployment URL

## Migration Checklist

### 1. Data Export Complete ✅
- All waitlist entries exported to `migration-export.csv`
- Includes access tokens for meal guide access
- Unsubscribe status preserved
- Source tracking maintained

### 2. Google Sheets Setup Required
- [ ] Create new Google Sheet in target account
- [ ] Deploy Google Apps Script (code provided in `google-apps-script-code.js`)
- [ ] Get deployment URL for environment variables
- [ ] Test integration with sample data

### 3. New Domain/Location Setup
- [ ] Set up new hosting environment
- [ ] Configure environment variables
- [ ] Deploy application with fresh database
- [ ] Import migrated data

### 4. Email Integration
- [ ] Update SMTP configuration for new domain
- [ ] Test email delivery from new location
- [ ] Update unsubscribe links to new domain
- [ ] Verify contact form notifications

### 5. DNS and Domain Updates
- [ ] Point new domain to deployment
- [ ] Update email authentication (SPF/DKIM/DMARC)
- [ ] Test all functionality end-to-end

## Google Sheets Integration Steps

1. **Create Google Sheet**
   - Go to sheets.google.com
   - Create new sheet named "SavviWell Data"
   - Note the Sheet ID from URL

2. **Deploy Apps Script**
   - Go to script.google.com
   - Create new project
   - Paste code from `google-apps-script-code.js`
   - Replace `YOUR_ACTUAL_SHEETS_ID_HERE` with your Sheet ID
   - Deploy as web app with execute permissions for "Anyone"
   - Copy deployment URL

3. **Environment Variables**
   ```bash
   GOOGLE_SCRIPT_DEPLOYMENT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   DATABASE_URL=postgresql://new_database_url
   SMTP_HOST=smtp.newdomain.com
   SMTP_USER=hello@newdomain.com
   ```

## Data Migration Commands

```sql
-- Import data to new database
INSERT INTO waitlist_entries (name, email, user_type, health_goal, dietary_concern, source, access_token, created_at, is_unsubscribed)
VALUES 
('Victoria Train', 'victoria.train@britishschool.pt', 'individual', 'energy', 'none', '', 'b706c2875813b8b1e4371753535072.902692', '2025-06-16T11:09:40.366Z', false),
-- ... (rest of entries)
```

## Testing Checklist After Migration

- [ ] Waitlist signup form working
- [ ] 5-day-meals lead magnet functional
- [ ] Email delivery to users
- [ ] Google Sheets receiving data
- [ ] Admin dashboard accessible
- [ ] Meal guide access with tokens
- [ ] Contact form notifications
- [ ] Unsubscribe functionality

## Rollback Plan
- Keep current database backup
- Maintain DNS records until migration verified
- Test all functionality before switching domains