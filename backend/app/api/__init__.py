from fastapi import APIRouter
from app.api import auth, users, services, bookings, payments, reviews, contact

api_router = APIRouter()

# Include all route modules
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(services.router)
api_router.include_router(bookings.router)
api_router.include_router(payments.router)
api_router.include_router(reviews.router)
api_router.include_router(contact.router)
