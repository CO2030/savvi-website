# SavviWell - AI-Powered Nutrition Assistant

## Overview

SavviWell is a comprehensive landing page and admin dashboard for an AI-powered nutrition and wellness platform. The application serves as a waitlist collection system for families and individuals interested in voice-guided nutrition support, featuring a modern React frontend with a Node.js/Express backend.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for type safety
- **Tailwind CSS** for responsive styling with custom design system
- **Wouter** for lightweight client-side routing
- **Framer Motion** for smooth animations and interactions
- **TanStack Query** for efficient data fetching and caching
- **Shadcn/ui** component library for consistent UI elements
- **React Hook Form** with Zod validation for form handling

### Backend Architecture
- **Node.js** with Express.js framework
- **TypeScript** throughout the stack for consistency
- **RESTful API** design with clear endpoint structure
- **Session-based authentication** for admin access
- **Modular service layer** for external integrations

### Build System
- **Vite** for fast development and optimized production builds
- **ESBuild** for server-side bundling
- **PostCSS** with Autoprefixer for CSS processing

## Key Components

### Database Layer
- **PostgreSQL** as the primary database
- **Drizzle ORM** for type-safe database operations
- **Schema-first approach** with Zod validation
- Tables: waitlist_entries, newsletter_subscribers, contact_submissions

### External Integrations
- **Google Apps Script** integration for spreadsheet data backup
- **Nodemailer** for email notifications
- **SendGrid** as backup email service option

### Admin Dashboard
- **Simple password-based authentication** (hardcoded for MVP)
- **Real-time data visualization** of waitlist entries
- **Export functionality** for data analysis
- **Contact form submission management**

## Data Flow

1. **User Registration Flow**:
   - Users fill multi-step waitlist form
   - Client-side validation with Zod schemas
   - Data submitted to `/api/waitlist` endpoint
   - Server validates and stores in PostgreSQL
   - Optional Google Sheets backup via Apps Script
   - Email notification sent to admin

2. **Admin Management Flow**:
   - Admin authenticates via `/admin/login`
   - Dashboard loads data via TanStack Query
   - Real-time updates without page refresh
   - Export capabilities for data analysis

3. **Contact Submission Flow**:
   - Contact form submissions via `/api/contact`
   - Email notifications to admin
   - Data stored for admin review

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection pool
- **drizzle-orm**: Type-safe ORM
- **@tanstack/react-query**: Data fetching and caching
- **framer-motion**: Animation library
- **wouter**: Lightweight routing
- **react-hook-form**: Form management
- **zod**: Schema validation

### UI/UX Dependencies
- **@radix-ui/***: Accessible component primitives
- **tailwindcss**: Utility-first CSS framework
- **canvas-confetti**: Success animations
- **react-share**: Social sharing components

### Email & Communication
- **nodemailer**: Email sending
- **@sendgrid/mail**: Alternative email service
- **axios**: HTTP client for external APIs

## Deployment Strategy

### Environment Configuration
- **Development**: Local PostgreSQL with hot reload
- **Production**: Optimized builds with environment variables
- **Docker support** available for containerized deployment

### Platform Support
- **Replit Deployments**: Native support with auto-detection
- **Vercel**: Frontend-optimized deployment
- **Railway**: Full-stack deployment with PostgreSQL addon

### Required Environment Variables
```bash
DATABASE_URL=postgresql://...
SESSION_SECRET=secure_random_string
SMTP_HOST=smtp.hostinger.com
SMTP_USER=hello@savviwell.com
SMTP_PASS=hostinger_app_password
GOOGLE_SCRIPT_DEPLOYMENT_URL=https://script.google.com/...
ADMIN_PASSWORD=secure_admin_password
NODE_ENV=production  # For production deployment
```

## User Flow Architecture

### Social Media Traffic Flow
1. **Entry Point**: `/5-day-meals` - Lead magnet signup form for social media traffic
2. **Form Completion**: User fills out waitlist form and gets instant PDF download
3. **Email Delivery**: User receives email with secure token link to access online guide
4. **Secure Access**: `/meal-guide?token=xxx` - Token-verified access to online meal guide

### Security Implementation
- **Access Tokens**: Generated for each waitlist entry (unique 32-character tokens)
- **Token Verification**: Backend validates tokens before showing meal guide content
- **Branded Access Denial**: Unauthorized users see attractive signup page instead of error
- **Personalized Experience**: Authorized users see personalized greeting with their name

### Analytics and Source Tracking
- **Comprehensive Source Detection**: Automatically captures user acquisition sources from URL parameters (utm_source, source, ref) and referrer analysis
- **Social Media Tracking**: Identifies traffic from Facebook, Instagram, Twitter, LinkedIn, YouTube, TikTok
- **Search Engine Detection**: Recognizes Google and Bing search traffic
- **Campaign Tracking**: Supports utm_campaign and utm_medium parameters for detailed campaign analysis
- **Lead Magnet Analytics**: Tracks performance of 5-day meal guide lead magnet with source attribution
- **Contact Form Sources**: All contact submissions include source tracking for lead attribution
- **Admin Dashboard Analytics**: Visual breakdown of user acquisition sources with marketing insights

## Changelog
- July 31, 2025: Fixed email delivery system with proper domain validation, cleaned test data, implemented referral tracking in emails, and resolved link issues for external email clients
- July 28, 2025: Added comprehensive admin security with server-side authentication and delete functionality for waitlist/contact entries
- July 26, 2025: Implemented secure token-based access for meal guide page
- June 24, 2025: Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.