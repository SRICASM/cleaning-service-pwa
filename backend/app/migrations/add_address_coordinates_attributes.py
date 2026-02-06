"""Add address coordinates and home attributes

This migration adds:
- latitude and longitude for GPS coordinates
- house_size for property size (1 BHK, 2 BHK, etc.)
- washrooms_count for number of washrooms
- residents_count for number of residents
- pet_type for pet information
"""

from sqlalchemy import text

def upgrade(conn):
    """Add new columns to addresses table"""
    
    # Add latitude and longitude for GPS coordinates
    conn.execute(text("""
        ALTER TABLE addresses 
        ADD COLUMN latitude DECIMAL(10, 8) NULL,
        ADD COLUMN longitude DECIMAL(11, 8) NULL
    """))
    
    # Add house size (e.g., "1 BHK", "2 BHK", etc.)
    conn.execute(text("""
        ALTER TABLE addresses 
        ADD COLUMN house_size VARCHAR(50) NULL
    """))
    
    # Add washrooms count
    conn.execute(text("""
        ALTER TABLE addresses 
        ADD COLUMN washrooms_count INTEGER NULL
    """))
    
    # Add residents count
    conn.execute(text("""
        ALTER TABLE addresses 
        ADD COLUMN residents_count INTEGER NULL
    """))
    
    # Add pet type (e.g., "No pets", "Cat", "Dog")
    conn.execute(text("""
        ALTER TABLE addresses 
        ADD COLUMN pet_type VARCHAR(50) NULL
    """))
    
    print("✅ Added address coordinates and home attributes columns")
    conn.commit()


def downgrade(conn):
    """Remove added columns"""
    
    conn.execute(text("""
        ALTER TABLE addresses 
        DROP COLUMN IF EXISTS latitude,
        DROP COLUMN IF EXISTS longitude,
        DROP COLUMN IF EXISTS house_size,
        DROP COLUMN IF EXISTS washrooms_count,
        DROP COLUMN IF EXISTS residents_count,
        DROP COLUMN IF EXISTS pet_type
    """))
    
    print("✅ Removed address coordinates and home attributes columns")
    conn.commit()


def run_migration(connection):
    """Entry point for manual migration execution"""
    try:
        upgrade(connection)
        return True
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        return False
