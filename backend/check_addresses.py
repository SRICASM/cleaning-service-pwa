from app.database import SessionLocal
from app.models.user import Address, User
from sqlalchemy import text

def check_addresses():
    db = SessionLocal()
    try:
        # Query all addresses
        addresses = db.query(Address).all()
        
        print(f"\nFound {len(addresses)} addresses in database:\n")
        
        for addr in addresses:
            user = db.query(User).filter(User.id == addr.user_id).first()
            user_name = user.full_name if user else f"User ID {addr.user_id}"
            
            print(f"ID: {addr.id} | User: {user_name} | Label: {addr.label}")
            print(f"   Address: {addr.street_address}, {addr.apartment}, {addr.city}")
            print(f"   Coords: {addr.latitude}, {addr.longitude}")
            print(f"   Attrs: {addr.house_size} | {addr.washrooms_count} Wash | {addr.residents_count} Res | Pet: {addr.pet_type}")
            print("-" * 50)
            
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_addresses()
