# SavviWell Analytics Implementation

## Source Tracking Overview

SavviWell now includes comprehensive source tracking to understand user acquisition channels and marketing performance.

## Supported URL Parameters

### UTM Parameters (Standard)
- `utm_source` - Primary source identifier
- `utm_campaign` - Campaign name
- `utm_medium` - Marketing medium

### Custom Parameters
- `source` - Simple source parameter
- `ref` - Referral parameter

## Example URLs

### Social Media Campaign URLs
```
https://savviwell.com/5-day-meals?utm_source=facebook&utm_campaign=healthy-eating-2025&utm_medium=social
https://savviwell.com/5-day-meals?utm_source=instagram&utm_campaign=meal-prep-tips&utm_medium=story
https://savviwell.com/5-day-meals?source=tiktok&campaign=viral-nutrition
```

### Influencer & Partnership URLs
```
https://savviwell.com/5-day-meals?source=influencer-sarah&campaign=collaboration
https://savviwell.com/5-day-meals?ref=health-blogger-review
https://savviwell.com/5-day-meals?utm_source=newsletter&utm_campaign=partner-wellness
```

### Email Campaign URLs
```
https://savviwell.com/5-day-meals?utm_source=email&utm_campaign=welcome-series&utm_medium=email
https://savviwell.com/5-day-meals?utm_source=newsletter&utm_campaign=monthly-tips
```

## Automatic Source Detection

### Social Media Referrers
- Facebook → `facebook`
- Instagram → `instagram`  
- Twitter/X → `twitter`
- LinkedIn → `linkedin`
- YouTube → `youtube`
- TikTok → `tiktok`

### Search Engines
- Google → `google-search`
- Bing → `bing-search`

### Default Sources
- Direct traffic (no referrer) → `direct`
- External websites → `external-website`

## Source Attribution Examples

### Lead Magnet Form Sources
- `5-day-lead-magnet-facebook` - Facebook traffic to lead magnet
- `5-day-lead-magnet-instagram-meal-prep-tips` - Instagram campaign with campaign name
- `5-day-lead-magnet-direct` - Direct traffic

### Contact Form Sources
- `contact-facebook` - Contact form from Facebook referrer
- `contact-modal-google-search` - Contact modal from Google search
- `contact-direct` - Direct contact form submission

## Analytics Dashboard Features

### Source Analytics Section
- **Waitlist Entry Sources** - Visual breakdown of lead magnet sources
- **Contact Entry Sources** - Analysis of contact form sources
- **Marketing Insights** - Key performance metrics including:
  - Top performing source
  - Social media conversion count
  - Lead magnet performance statistics

### Admin Dashboard Access
Visit `/admin/dashboard` (password: KalmarLisbon00025) to view:
- Source breakdown by acquisition channel
- Campaign performance metrics
- User behavior analytics
- Delete functionality for data management

## Implementation Benefits

1. **Marketing ROI Tracking** - Understand which channels drive the most valuable users
2. **Campaign Optimization** - Identify best-performing campaigns for budget allocation
3. **Content Strategy** - See which content formats and platforms resonate with your audience
4. **Lead Attribution** - Full customer journey tracking from first touch to conversion
5. **Data-Driven Decisions** - Make informed marketing investments based on actual performance data

## Privacy & Compliance

- Source tracking uses only publicly available referrer information and URL parameters
- No personal identifying information is collected beyond what users voluntarily provide
- Data is stored securely and only accessible to authorized admin users
- Users can request data deletion through the admin dashboard