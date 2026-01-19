#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime, timedelta

class BrightHomeAPITester:
    def __init__(self, base_url="https://brighthome.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.token = None
        self.admin_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name}")
        else:
            print(f"❌ {name} - {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details
        })

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        if headers:
            test_headers.update(headers)

        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers)

            success = response.status_code == expected_status
            details = f"Status: {response.status_code}"
            
            if not success:
                details += f", Expected: {expected_status}"
                try:
                    error_data = response.json()
                    details += f", Error: {error_data.get('detail', 'Unknown error')}"
                except:
                    details += f", Response: {response.text[:100]}"

            self.log_test(name, success, details)
            return success, response.json() if success and response.content else {}

        except Exception as e:
            self.log_test(name, False, f"Exception: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test basic API health"""
        return self.run_test("API Health Check", "GET", "", 200)

    def test_seed_data(self):
        """Test data seeding"""
        return self.run_test("Seed Data", "POST", "seed", 200)

    def test_get_services(self):
        """Test getting services"""
        success, data = self.run_test("Get Services", "GET", "services", 200)
        if success and len(data) >= 6:
            self.log_test("Services Count Check", True, f"Found {len(data)} services")
        elif success:
            self.log_test("Services Count Check", False, f"Expected 6+ services, got {len(data)}")
        return success, data

    def test_get_addons(self):
        """Test getting add-ons"""
        success, data = self.run_test("Get Add-ons", "GET", "add-ons", 200)
        if success and len(data) >= 8:
            self.log_test("Add-ons Count Check", True, f"Found {len(data)} add-ons")
        elif success:
            self.log_test("Add-ons Count Check", False, f"Expected 8+ add-ons, got {len(data)}")
        return success, data

    def test_user_registration(self):
        """Test user registration"""
        test_user_data = {
            "email": f"test_user_{datetime.now().strftime('%H%M%S')}@test.com",
            "name": "Test User",
            "phone": "+1234567890",
            "password": "TestPass123!"
        }
        
        success, response = self.run_test("User Registration", "POST", "auth/register", 200, test_user_data)
        if success and 'token' in response:
            self.token = response['token']
            self.test_user_email = test_user_data['email']
            self.log_test("Registration Token Check", True, "Token received")
        elif success:
            self.log_test("Registration Token Check", False, "No token in response")
        return success

    def test_user_login(self):
        """Test user login with registered user"""
        if not hasattr(self, 'test_user_email'):
            self.log_test("User Login", False, "No test user email available")
            return False
            
        login_data = {
            "email": self.test_user_email,
            "password": "TestPass123!"
        }
        
        success, response = self.run_test("User Login", "POST", "auth/login", 200, login_data)
        if success and 'token' in response:
            self.token = response['token']
            self.log_test("Login Token Check", True, "Token received")
        elif success:
            self.log_test("Login Token Check", False, "No token in response")
        return success

    def test_admin_login(self):
        """Test admin login"""
        admin_data = {
            "email": "admin@brighthome.com",
            "password": "admin123"
        }
        
        success, response = self.run_test("Admin Login", "POST", "auth/login", 200, admin_data)
        if success and 'token' in response:
            self.admin_token = response['token']
            user_role = response.get('user', {}).get('role')
            if user_role == 'admin':
                self.log_test("Admin Role Check", True, "Admin role confirmed")
            else:
                self.log_test("Admin Role Check", False, f"Expected admin role, got {user_role}")
        elif success:
            self.log_test("Admin Login Token Check", False, "No token in response")
        return success

    def test_protected_route(self):
        """Test protected route access"""
        if not self.token:
            self.log_test("Protected Route Test", False, "No user token available")
            return False
            
        headers = {'Authorization': f'Bearer {self.token}'}
        return self.run_test("Get User Profile", "GET", "auth/me", 200, headers=headers)

    def test_create_booking(self):
        """Test booking creation"""
        if not self.token:
            self.log_test("Create Booking", False, "No user token available")
            return False, {}
            
        # First get a service ID
        success, services = self.test_get_services()
        if not success or not services:
            self.log_test("Create Booking", False, "No services available")
            return False, {}
            
        service = services[0]
        tomorrow = (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')
        
        booking_data = {
            "service_id": service['id'],
            "service_name": service['name'],
            "property_type": "apartment",
            "property_size": 1000,
            "bedrooms": 2,
            "bathrooms": 1,
            "address": "123 Test Street",
            "city": "San Francisco",
            "postal_code": "94102",
            "scheduled_date": tomorrow,
            "scheduled_time": "10:00 AM",
            "add_ons": [],
            "special_instructions": "Test booking"
        }
        
        headers = {'Authorization': f'Bearer {self.token}'}
        success, response = self.run_test("Create Booking", "POST", "bookings", 200, booking_data, headers)
        
        if success and 'id' in response:
            self.booking_id = response['id']
            self.log_test("Booking ID Check", True, f"Booking created with ID: {response['id']}")
        elif success:
            self.log_test("Booking ID Check", False, "No booking ID in response")
            
        return success, response

    def test_get_user_bookings(self):
        """Test getting user bookings"""
        if not self.token:
            self.log_test("Get User Bookings", False, "No user token available")
            return False
            
        headers = {'Authorization': f'Bearer {self.token}'}
        return self.run_test("Get User Bookings", "GET", "bookings", 200, headers=headers)

    def test_admin_stats(self):
        """Test admin statistics"""
        if not self.admin_token:
            self.log_test("Admin Stats", False, "No admin token available")
            return False
            
        headers = {'Authorization': f'Bearer {self.admin_token}'}
        success, data = self.run_test("Admin Stats", "GET", "admin/stats", 200, headers=headers)
        
        if success:
            required_fields = ['total_bookings', 'pending_bookings', 'total_customers', 'total_revenue']
            missing_fields = [field for field in required_fields if field not in data]
            if not missing_fields:
                self.log_test("Admin Stats Fields Check", True, "All required fields present")
            else:
                self.log_test("Admin Stats Fields Check", False, f"Missing fields: {missing_fields}")
                
        return success

    def test_admin_bookings(self):
        """Test admin bookings access"""
        if not self.admin_token:
            self.log_test("Admin Bookings", False, "No admin token available")
            return False
            
        headers = {'Authorization': f'Bearer {self.admin_token}'}
        return self.run_test("Admin Get All Bookings", "GET", "admin/bookings", 200, headers=headers)

    def test_admin_customers(self):
        """Test admin customers access"""
        if not self.admin_token:
            self.log_test("Admin Customers", False, "No admin token available")
            return False
            
        headers = {'Authorization': f'Bearer {self.admin_token}'}
        return self.run_test("Admin Get Customers", "GET", "admin/customers", 200, headers=headers)

    def test_contact_form(self):
        """Test contact form submission"""
        contact_data = {
            "name": "Test Contact",
            "email": "test@example.com",
            "phone": "+1234567890",
            "subject": "Test Message",
            "message": "This is a test contact message"
        }
        
        success, response = self.run_test("Contact Form", "POST", "contact", 200, contact_data)
        if success and 'id' in response:
            self.log_test("Contact Form ID Check", True, f"Message created with ID: {response['id']}")
        elif success:
            self.log_test("Contact Form ID Check", False, "No message ID in response")
        return success

    def test_admin_contacts(self):
        """Test admin contacts access"""
        if not self.admin_token:
            self.log_test("Admin Contacts", False, "No admin token available")
            return False
            
        headers = {'Authorization': f'Bearer {self.admin_token}'}
        return self.run_test("Admin Get Contacts", "GET", "admin/contacts", 200, headers=headers)

    def run_all_tests(self):
        """Run comprehensive test suite"""
        print(f"🧪 Starting BrightHome API Tests")
        print(f"🌐 Testing against: {self.base_url}")
        print("=" * 60)
        
        # Basic tests
        self.test_health_check()
        self.test_seed_data()
        
        # Public endpoints
        self.test_get_services()
        self.test_get_addons()
        
        # User authentication flow
        self.test_user_registration()
        self.test_user_login()
        self.test_protected_route()
        
        # Admin authentication
        self.test_admin_login()
        
        # Booking flow
        self.test_create_booking()
        self.test_get_user_bookings()
        
        # Admin functionality
        self.test_admin_stats()
        self.test_admin_bookings()
        self.test_admin_customers()
        
        # Contact form
        self.test_contact_form()
        self.test_admin_contacts()
        
        # Print summary
        print("=" * 60)
        print(f"📊 Tests completed: {self.tests_passed}/{self.tests_run} passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            print(f"⚠️  {self.tests_run - self.tests_passed} tests failed")
            return 1

def main():
    tester = BrightHomeAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())