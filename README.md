# SavviWell - AI-Powered Nutrition Assistant

A comprehensive landing page and admin dashboard for SavviWell, your voice-guided partner in healthy living.

## Overview

SavviWell is a voice-powered AI wellness assistant that helps families and individuals simplify healthy eating through personalized, nutrition-focused support. It goes beyond traditional meal planning apps by offering smart grocery lists, adaptive meal recommendations, and wellness guidance tailored to your lifestyle.

## Features

- **Landing Page**: Modern, responsive design with hero sections, feature highlights, and testimonials
- **Story Page**: Company background and founder information
- **FAQ Section**: Comprehensive answers about the SavviWell platform
- **Waitlist Management**: Complete system for collecting and managing early user signups
- **Admin Dashboard**: Secure backend for viewing waitlist entries and contact submissions
- **Contact System**: Form handling for user inquiries
- **Mobile Responsive**: Optimized for all device sizes with custom CSS media queries

## Tech Stack

### Frontend
- **React** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Wouter** for routing
- **TanStack Query** for data fetching
- **React Hook Form** with Zod validation
- **Shadcn/ui** components

### Backend
- **Node.js** with Express
- **PostgreSQL** database
- **Drizzle ORM** for database operations
- **Nodemailer** for email notifications
- **Google Apps Script** integration

### Infrastructure
- **Vite** for development and building
- **TypeScript** for type safety
- **ESBuild** for fast compilation

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Environment variables configured

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/savviwell.git
cd savviwell
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Database
DATABASE_URL=your_postgresql_connection_string

# Email (optional)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password

# Google Scripts (optional)
GOOGLE_SCRIPT_DEPLOYMENT_URL=your_google_script_url
```

4. Run database migrations:
```bash
npm run db:migrate
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility functions
├── server/                # Backend Express server
│   ├── services/          # Business logic services
│   ├── db.ts             # Database connection
│   ├── routes.ts         # API routes
│   └── storage.ts        # Data access layer
├── shared/               # Shared TypeScript types and schemas
└── drizzle.config.ts    # Database configuration
```

## API Endpoints

### Waitlist
- `POST /api/waitlist` - Join the waitlist
- `GET /api/waitlist` - Get all waitlist entries (admin)

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contact submissions (admin)

### Newsletter
- `POST /api/newsletter` - Subscribe to newsletter
- `GET /api/newsletter` - Get all newsletter subscribers (admin)

## Admin Access

The admin dashboard is accessible at `/admin/dashboard` and requires password authentication. Contact administrators for access credentials.

## Deployment

The application is designed to be deployed on platforms like:
- Replit Deployments
- Vercel
- Netlify
- Railway
- Heroku

Ensure all environment variables are properly configured in your deployment environment.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is proprietary software. All rights reserved.

## Contact

For questions or support, please contact the SavviWell team.

---

**SavviWell** - Tech with Heart. Made by Moms.