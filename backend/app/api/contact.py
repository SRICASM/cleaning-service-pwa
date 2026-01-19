from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timezone
from app.database import get_db
from app.api.deps import get_admin_user
from app.core.exceptions import NotFoundException
from app.models import ContactMessage, User
from app.schemas import (
    ContactMessageCreate, ContactMessageUpdate, 
    ContactMessageReply, ContactMessageResponse
)

router = APIRouter(prefix="/contact", tags=["Contact"])


@router.post("/", response_model=ContactMessageResponse)
async def submit_contact_message(
    data: ContactMessageCreate,
    db: Session = Depends(get_db)
):
    """Submit a contact form message (public endpoint)."""
    message = ContactMessage(
        name=data.name,
        email=data.email,
        phone=data.phone,
        subject=data.subject,
        message=data.message,
        status="new"
    )
    
    db.add(message)
    db.commit()
    db.refresh(message)
    
    return message


@router.get("/admin", response_model=List[ContactMessageResponse])
async def list_contact_messages(
    status: str = None,
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Admin: List all contact messages."""
    query = db.query(ContactMessage)
    
    if status:
        query = query.filter(ContactMessage.status == status)
    
    messages = query.order_by(ContactMessage.created_at.desc()).all()
    return messages


@router.get("/admin/{message_id}", response_model=ContactMessageResponse)
async def get_contact_message(
    message_id: int,
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Admin: Get contact message details."""
    message = db.query(ContactMessage).filter(
        ContactMessage.id == message_id
    ).first()
    
    if not message:
        raise NotFoundException("Message not found")
    
    # Mark as read
    if message.status == "new":
        message.status = "read"
        db.commit()
    
    return message


@router.put("/admin/{message_id}", response_model=ContactMessageResponse)
async def update_contact_message(
    message_id: int,
    data: ContactMessageUpdate,
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Admin: Update contact message status."""
    message = db.query(ContactMessage).filter(
        ContactMessage.id == message_id
    ).first()
    
    if not message:
        raise NotFoundException("Message not found")
    
    if data.status:
        message.status = data.status
    if data.assigned_to_id:
        message.assigned_to_id = data.assigned_to_id
    
    db.commit()
    db.refresh(message)
    
    return message


@router.post("/admin/{message_id}/reply")
async def reply_to_message(
    message_id: int,
    data: ContactMessageReply,
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Admin: Reply to a contact message."""
    message = db.query(ContactMessage).filter(
        ContactMessage.id == message_id
    ).first()
    
    if not message:
        raise NotFoundException("Message not found")
    
    message.reply = data.reply
    message.replied_at = datetime.now(timezone.utc)
    message.replied_by_id = admin.id
    message.status = "replied"
    
    db.commit()
    
    # TODO: Send email to the user with the reply
    
    return {"message": "Reply sent"}
