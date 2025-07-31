# DNS Records Setup for Email Authentication

## SPF Record (Required)
Add this TXT record to your domain DNS:

**Type**: TXT  
**Name**: @ (or your domain name)  
**Value**: `v=spf1 include:_spf.hostinger.com ~all`

## DKIM Setup (Required)
1. Log into Hostinger control panel
2. Go to Email → Email Accounts → Advanced
3. Enable DKIM authentication
4. Copy the DKIM record provided by Hostinger
5. Add as TXT record in your DNS

## DMARC Record (Required)
Add this TXT record:

**Type**: TXT  
**Name**: _dmarc  
**Value**: `v=DMARC1; p=quarantine; rua=mailto:hello@savviwell.com; ruf=mailto:hello@savviwell.com; pct=100`

## Verification
After adding records, verify using:
- SPF: dig TXT yourdomain.com
- DKIM: Use Hostinger's verification tool
- DMARC: dig TXT _dmarc.yourdomain.com

These records will significantly improve email deliverability and reputation.