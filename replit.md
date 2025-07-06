# DeliverMail.io - Email Service Platform

## Overview

DeliverMail.io is a full-stack email service platform modeled after SendGrid, providing comprehensive email delivery services. The application features a modern React frontend with a Node.js/Express backend, PostgreSQL database with Drizzle ORM, and integrates with Stripe for billing and SMTP services for email delivery.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Styling**: TailwindCSS with Radix UI components (shadcn/ui)
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for development and production builds
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Authentication**: Custom JWT-based auth with Passport.js and bcrypt password hashing
- **Session Management**: Express sessions with memory store
- **Email Delivery**: Nodemailer for SMTP integration
- **Payment Processing**: Stripe integration for subscription billing

### Data Storage Solutions
- **Primary Database**: PostgreSQL (Replit-hosted) with automatic failover to in-memory storage
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations
- **Session Store**: PostgreSQL session store with automatic table creation

## Key Components

### Authentication System
- Custom JWT implementation with role-based access control (user/admin)
- Secure password hashing using bcrypt with salt
- Session-based authentication with Passport.js LocalStrategy
- Protected routes for authenticated users and admin-only areas

### Core Features
1. **Email Management**:
   - Template CRUD operations with validation
   - Email sending via SMTP with logging
   - Email delivery tracking and status monitoring

2. **API Management**:
   - API key generation and management
   - Scope-based permissions for API access
   - Usage tracking and rate limiting capabilities

3. **User Dashboard**:
   - Email statistics and analytics
   - Template management interface
   - Email log filtering and search
   - Account settings and billing management

4. **Admin Panel**:
   - User management and administration
   - System-wide analytics and monitoring
   - Plan management and Stripe integration
   - System log viewing and filtering

### UI Components
- Comprehensive component library using shadcn/ui
- Responsive design with mobile-first approach
- Consistent theming with CSS variables
- Accessible components following ARIA standards

## Data Flow

1. **User Authentication**: Login/signup → JWT token → Session establishment → Route protection
2. **Email Sending**: Template creation → Email composition → SMTP delivery → Status logging
3. **API Usage**: API key authentication → Request validation → Service execution → Usage logging
4. **Billing Flow**: Plan selection → Stripe Checkout → Subscription management → Usage tracking

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless database connection
- **drizzle-orm**: Type-safe ORM for database operations
- **passport**: Authentication middleware
- **bcrypt**: Password hashing
- **nodemailer**: Email delivery service
- **stripe**: Payment processing
- **@tanstack/react-query**: Server state management

### Development Tools
- **vite**: Build tool and dev server
- **typescript**: Type safety
- **tailwindcss**: Utility-first CSS framework
- **@replit/vite-plugin-runtime-error-modal**: Development error handling

## Deployment Strategy

### Build Process
- Frontend: Vite builds React app to `dist/public`
- Backend: esbuild bundles Node.js server to `dist/index.js`
- Database: Drizzle migrations applied via `npm run db:push`

### Environment Configuration
- Development: `npm run dev` - runs TypeScript directly with tsx
- Production: `npm run build && npm start` - builds and runs compiled JavaScript
- Database URL required via `DATABASE_URL` environment variable
- Stripe keys for payment processing
- SMTP credentials for email delivery

### Hosting Considerations
- Static assets served from `dist/public`
- API routes served from Express server
- Database connection via Neon PostgreSQL
- Session store should be upgraded to Redis for production scaling

## Changelog

- July 06, 2025. Added PostgreSQL database with automatic schema migration and demo user initialization
- July 05, 2025. Initial setup with in-memory storage

## User Preferences

Preferred communication style: Simple, everyday language.