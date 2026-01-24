#!/usr/bin/env python3
"""
MongoDB Query Script for CleanUpCrew
Run with: python query_db.py
"""

from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017")
db = client.cleanupcrew

print("=" * 50)
print("CLEANUPCREW DATABASE ANALYSIS")
print("=" * 50)

# === BOOKINGS ===
print("\n📅 BOOKINGS:")
print("-" * 40)
for booking in db.bookings.find():
    print(f"  • {booking['user_name']}")
    print(f"    Service: {booking['service_name']}")
    print(f"    Amount: ${booking['total_price']} | Status: {booking['status']}")
    print(f"    Date: {booking['scheduled_date']} at {booking['scheduled_time']}")
    print()

# === STATS ===
print("\n📊 STATISTICS:")
print("-" * 40)
total_bookings = db.bookings.count_documents({})
paid_bookings = db.bookings.count_documents({"payment_status": "paid"})
total_revenue = sum(b['total_price'] for b in db.bookings.find({"payment_status": "paid"}))
total_users = db.users.count_documents({})
total_services = db.services.count_documents({})

print(f"  Total Bookings: {total_bookings}")
print(f"  Paid Bookings: {paid_bookings}")
print(f"  Total Revenue: ${total_revenue}")
print(f"  Total Users: {total_users}")
print(f"  Total Services: {total_services}")

# === USERS ===
print("\n👥 USERS:")
print("-" * 40)
for user in db.users.find({}, {"password": 0}):
    role = user.get('role', 'customer')
    print(f"  • {user.get('first_name', '')} {user.get('last_name', '')} ({role})")
    print(f"    Email: {user['email']}")
    print()

# === SERVICES ===
print("\n🧹 SERVICES:")
print("-" * 40)
for service in db.services.find():
    print(f"  • {service['name']} - ${service['base_price']}")
