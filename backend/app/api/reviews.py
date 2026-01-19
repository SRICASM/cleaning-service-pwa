from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime, timezone
from app.database import get_db
from app.api.deps import get_current_user, get_admin_user
from app.core.exceptions import NotFoundException, ForbiddenException, BadRequestException
from app.models import Review, Booking, User, BookingStatus
from app.schemas import (
    ReviewCreate, ReviewUpdate, ReviewResponse, ReviewResponseAdd, ReviewStats
)

router = APIRouter(prefix="/reviews", tags=["Reviews"])


@router.post("/", response_model=ReviewResponse)
async def create_review(
    data: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a review for a completed booking."""
    # Validate booking
    booking = db.query(Booking).filter(Booking.id == data.booking_id).first()
    
    if not booking:
        raise NotFoundException("Booking not found")
    
    if booking.customer_id != current_user.id:
        raise ForbiddenException()
    
    if booking.status != BookingStatus.COMPLETED:
        raise BadRequestException("Can only review completed bookings")
    
    # Check if review already exists
    existing = db.query(Review).filter(Review.booking_id == data.booking_id).first()
    if existing:
        raise BadRequestException("Review already exists for this booking")
    
    # Create review
    review = Review(
        booking_id=data.booking_id,
        customer_id=current_user.id,
        cleaner_id=booking.cleaner_id,
        overall_rating=data.overall_rating,
        cleanliness_rating=data.cleanliness_rating,
        punctuality_rating=data.punctuality_rating,
        communication_rating=data.communication_rating,
        value_rating=data.value_rating,
        title=data.title,
        comment=data.comment,
        is_verified=True  # Verified because it's from a real booking
    )
    
    db.add(review)
    db.commit()
    db.refresh(review)
    
    return ReviewResponse(
        id=review.id,
        booking_id=review.booking_id,
        customer_id=review.customer_id,
        customer_name=f"{current_user.first_name} {current_user.last_name}",
        overall_rating=review.overall_rating,
        cleanliness_rating=review.cleanliness_rating,
        punctuality_rating=review.punctuality_rating,
        communication_rating=review.communication_rating,
        value_rating=review.value_rating,
        title=review.title,
        comment=review.comment,
        response=review.response,
        response_at=review.response_at,
        is_verified=review.is_verified,
        is_published=review.is_published,
        created_at=review.created_at
    )


@router.get("/", response_model=List[ReviewResponse])
async def list_reviews(
    service_id: Optional[int] = Query(None),
    min_rating: Optional[int] = Query(None, ge=1, le=5),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get public reviews."""
    query = db.query(Review).filter(Review.is_published == True)
    
    if service_id:
        query = query.join(Booking).filter(Booking.service_id == service_id)
    
    if min_rating:
        query = query.filter(Review.overall_rating >= min_rating)
    
    reviews = query.order_by(Review.created_at.desc()).offset(skip).limit(limit).all()
    
    result = []
    for review in reviews:
        customer = db.query(User).filter(User.id == review.customer_id).first()
        result.append(ReviewResponse(
            id=review.id,
            booking_id=review.booking_id,
            customer_id=review.customer_id,
            customer_name=f"{customer.first_name} {customer.last_name[0]}.",
            overall_rating=review.overall_rating,
            cleanliness_rating=review.cleanliness_rating,
            punctuality_rating=review.punctuality_rating,
            communication_rating=review.communication_rating,
            value_rating=review.value_rating,
            title=review.title,
            comment=review.comment,
            response=review.response,
            response_at=review.response_at,
            is_verified=review.is_verified,
            is_published=review.is_published,
            created_at=review.created_at
        ))
    
    return result


@router.get("/stats", response_model=ReviewStats)
async def get_review_stats(
    service_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    """Get aggregate review statistics."""
    query = db.query(Review).filter(Review.is_published == True)
    
    if service_id:
        query = query.join(Booking).filter(Booking.service_id == service_id)
    
    total = query.count()
    
    if total == 0:
        return ReviewStats(
            total_reviews=0,
            average_rating=0.0,
            rating_distribution={1: 0, 2: 0, 3: 0, 4: 0, 5: 0},
            average_cleanliness=None,
            average_punctuality=None,
            average_communication=None,
            average_value=None
        )
    
    # Average ratings
    avg_overall = db.query(func.avg(Review.overall_rating)).filter(
        Review.is_published == True
    ).scalar() or 0
    
    avg_cleanliness = db.query(func.avg(Review.cleanliness_rating)).filter(
        Review.is_published == True,
        Review.cleanliness_rating.isnot(None)
    ).scalar()
    
    avg_punctuality = db.query(func.avg(Review.punctuality_rating)).filter(
        Review.is_published == True,
        Review.punctuality_rating.isnot(None)
    ).scalar()
    
    avg_communication = db.query(func.avg(Review.communication_rating)).filter(
        Review.is_published == True,
        Review.communication_rating.isnot(None)
    ).scalar()
    
    avg_value = db.query(func.avg(Review.value_rating)).filter(
        Review.is_published == True,
        Review.value_rating.isnot(None)
    ).scalar()
    
    # Rating distribution
    distribution = {}
    for rating in range(1, 6):
        count = query.filter(Review.overall_rating == rating).count()
        distribution[rating] = count
    
    return ReviewStats(
        total_reviews=total,
        average_rating=round(float(avg_overall), 1),
        rating_distribution=distribution,
        average_cleanliness=round(float(avg_cleanliness), 1) if avg_cleanliness else None,
        average_punctuality=round(float(avg_punctuality), 1) if avg_punctuality else None,
        average_communication=round(float(avg_communication), 1) if avg_communication else None,
        average_value=round(float(avg_value), 1) if avg_value else None
    )


# ============ Admin: Review Management ============

@router.put("/admin/{review_id}/respond")
async def respond_to_review(
    review_id: int,
    data: ReviewResponseAdd,
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Admin: Add response to a review."""
    review = db.query(Review).filter(Review.id == review_id).first()
    
    if not review:
        raise NotFoundException("Review not found")
    
    review.response = data.response
    review.response_at = datetime.now(timezone.utc)
    review.response_by_id = admin.id
    
    db.commit()
    
    return {"message": "Response added"}


@router.put("/admin/{review_id}/publish")
async def toggle_review_publish(
    review_id: int,
    publish: bool,
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Admin: Publish or unpublish a review."""
    review = db.query(Review).filter(Review.id == review_id).first()
    
    if not review:
        raise NotFoundException("Review not found")
    
    review.is_published = publish
    db.commit()
    
    return {"message": f"Review {'published' if publish else 'unpublished'}"}


@router.put("/admin/{review_id}/feature")
async def toggle_review_feature(
    review_id: int,
    feature: bool,
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Admin: Feature or unfeature a review."""
    review = db.query(Review).filter(Review.id == review_id).first()
    
    if not review:
        raise NotFoundException("Review not found")
    
    review.is_featured = feature
    db.commit()
    
    return {"message": f"Review {'featured' if feature else 'unfeatured'}"}
