# CleanUpCrew - Cleaning Service Platform

## Project Overview
Full-stack cleaning service platform (PWA) with customer booking, employee management, subscriptions, and admin dashboard.

## Tech Stack

### Backend
- **Framework:** FastAPI (Python 3.8+)
- **Database:** PostgreSQL + SQLAlchemy 2.0 ORM
- **Migrations:** Alembic (manual migration files in `backend/app/migrations/`)
- **Auth:** JWT (PyJWT + python-jose), bcrypt password hashing
- **Payments:** Stripe
- **Caching:** Redis (optional)
- **SMS:** Twilio
- **AI:** Google Generative AI, OpenAI, LiteLLM

### Frontend
- **Framework:** React 18 (CRA + Craco)
- **Routing:** React Router DOM 6
- **Styling:** TailwindCSS 3 + shadcn/ui (Radix UI primitives)
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod
- **Dates:** date-fns + react-day-picker
- **Maps:** Leaflet + react-leaflet
- **Charts:** Recharts
- **HTTP:** Axios
- **Notifications:** Sonner (toasts)
- **State:** React Context (AuthContext, CartContext)

## Common Commands

```bash
# Backend
cd backend
source venv/bin/activate
uvicorn server:app --reload --port 8000

# Frontend
cd frontend
npm start              # Dev server (port 3000)
npm run build          # Production build
npm test               # Run tests

# API docs
open http://localhost:8000/docs
```

## Project Structure

```
application/
├── backend/
│   ├── main.py                  # FastAPI app init
│   ├── server.py                # Entry point
│   └── app/
│       ├── config.py            # Settings (pydantic BaseSettings)
│       ├── database.py          # SQLAlchemy setup
│       ├── api/                 # Route endpoints
│       │   ├── auth.py          # Login, register, password reset
│       │   ├── auth_otp.py      # OTP authentication
│       │   ├── auth_employee.py # Employee auth
│       │   ├── bookings.py      # Booking CRUD
│       │   ├── payments.py      # Stripe payments
│       │   ├── users.py         # User profiles & addresses
│       │   ├── services.py      # Service catalog
│       │   ├── subscriptions.py # Subscription management
│       │   ├── availability.py  # Slot checking
│       │   ├── admin_dashboard.py
│       │   ├── cleaner_dashboard.py
│       │   └── deps.py          # Auth guards (get_current_user, etc.)
│       ├── models/              # SQLAlchemy ORM models
│       ├── schemas/             # Pydantic request/response
│       ├── services/            # Business logic
│       │   ├── allocation_engine.py
│       │   ├── booking_service.py
│       │   ├── pricing_engine.py
│       │   ├── subscription_service.py
│       │   └── job_state_machine.py
│       └── migrations/          # Alembic migrations
│
├── frontend/
│   └── src/
│       ├── App.js               # Router & routes
│       ├── context/             # AuthContext, CartContext
│       ├── hooks/               # useAuth, useBookingForm, usePWA, etc.
│       ├── pages/               # 31 route pages
│       └── components/
│           ├── Navbar.jsx
│           ├── booking/         # 25+ booking components
│           ├── address/         # Address flow components
│           ├── subscription/    # Subscription UI
│           ├── admin/           # Admin components
│           └── ui/              # 56 shadcn/Radix components
```

## Auth System
- **User roles:** CUSTOMER, CLEANER, ADMIN
- **Token:** JWT access (24hr) + refresh (7 days)
- **Guards:** `get_current_user()`, `get_current_employee()`, `get_admin_user()`
- **Frontend:** AuthContext stores token in localStorage, auto-redirects by role

## API Base URL
`${REACT_APP_BACKEND_URL}/api` (default: `http://localhost:8000/api`)

## Key API Endpoints
- `/auth/login`, `/auth/register`, `/auth/me`
- `/services` - Service catalog
- `/bookings/` - Booking CRUD
- `/users/me/addresses` - Address management
- `/subscriptions` - Subscription plans
- `/payments` - Stripe checkout
- `/availability` - Slot checking

## Database Tables
users, addresses, services, service_categories, bookings, payments, reviews, employees, subscriptions, refresh_tokens, wallets, referrals

## Booking Status Flow
`pending → confirmed → assigned → in_progress → completed`
(also: cancelled, refunded, no_show)

## Environment Variables

### Backend (.env)
- `DATABASE_URL` - PostgreSQL connection
- `JWT_SECRET_KEY` - Token signing
- `STRIPE_API_KEY` / `STRIPE_WEBHOOK_SECRET`
- `CORS_ORIGINS` - Allowed frontend origins
- `REDIS_URL` (optional)
- `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` / `TWILIO_PHONE_NUMBER`

### Frontend (.env)
- `REACT_APP_BACKEND_URL` - API base URL
- `REACT_APP_STRIPE_PUBLISHABLE_KEY`

## Coding Conventions
- **Frontend components:** PascalCase, `.jsx` extension
- **Styling:** TailwindCSS utility classes, emerald as primary color
- **UI library:** shadcn/ui pattern - components in `components/ui/`
- **Booking components:** `components/booking/` - each has specific responsibility
- **Backend routes:** snake_case, grouped by domain in `app/api/`
- **Backend models:** SQLAlchemy declarative, one model per file in `app/models/`
- **Schemas:** Pydantic v2, separate Create/Update/Response schemas

## Schedule Booking Page Reference
See `frontend/src/pages/SCHEDULE_BOOKING_COMPONENTS.md` for detailed component flow, element references, and visual layout of the booking page.

## Service Pricing Multipliers
- Standard Cleaning: 1x (base rate)
- Deep Cleaning: 2x
- Move In/Out: 2.5x

Applies to both "By House Size" and "By Hourly Rate" pricing modes.
Base hourly rate: AED 75/hr (Standard).
