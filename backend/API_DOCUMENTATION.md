# BrightHome API Endpoints Documentation

## Authentication Endpoints

### POST /api/auth/register
Create a new user account.
- **Auth Required:** No
- **Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+14155551234"
}
```
- **Response:** TokenResponse with access_token and refresh_token

### POST /api/auth/login
Login with credentials.
- **Auth Required:** No
- **Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```
- **Response:** TokenResponse

### POST /api/auth/refresh
Get new access token using refresh token.
- **Auth Required:** No
- **Request Body:**
```json
{
  "refresh_token": "eyJ..."
}
```
- **Response:** TokenResponse

### POST /api/auth/logout
Revoke refresh token.
- **Auth Required:** No
- **Request Body:**
```json
{
  "refresh_token": "eyJ..."
}
```

### POST /api/auth/password-reset/request
Request password reset email.
- **Auth Required:** No
- **Request Body:**
```json
{
  "email": "user@example.com"
}
```

### POST /api/auth/password-reset/confirm
Reset password with token.
- **Auth Required:** No
- **Request Body:**
```json
{
  "token": "reset-token-here",
  "new_password": "newpassword123"
}
```

---

## User Endpoints

### GET /api/users/me
Get current user profile.
- **Auth Required:** Yes (Customer+)
- **Response:** UserResponse

### PUT /api/users/me
Update current user profile.
- **Auth Required:** Yes (Customer+)
- **Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Smith",
  "phone": "+14155559999"
}
```

### GET /api/users/me/addresses
Get user's saved addresses.
- **Auth Required:** Yes (Customer+)
- **Response:** List[AddressResponse]

### POST /api/users/me/addresses
Create new address.
- **Auth Required:** Yes (Customer+)
- **Request Body:**
```json
{
  "label": "Home",
  "street_address": "123 Main St",
  "apartment": "4B",
  "city": "San Francisco",
  "state": "CA",
  "postal_code": "94102",
  "property_type": "apartment",
  "property_size_sqft": 1200,
  "bedrooms": 2,
  "bathrooms": 1,
  "is_default": true
}
```

### PUT /api/users/me/addresses/{address_id}
Update address.
- **Auth Required:** Yes (Customer+)

### DELETE /api/users/me/addresses/{address_id}
Delete address.
- **Auth Required:** Yes (Customer+)

### GET /api/users/ (Admin)
List all users with filters.
- **Auth Required:** Yes (Admin)
- **Query Params:** role, status, search, skip, limit

### PUT /api/users/{user_id}/status (Admin)
Update user status.
- **Auth Required:** Yes (Admin)

### PUT /api/users/{user_id}/role (Admin)
Update user role.
- **Auth Required:** Yes (Admin)

---

## Service Endpoints

### GET /api/services/categories
Get all service categories.
- **Auth Required:** No
- **Response:** List[ServiceCategoryResponse]

### GET /api/services/
Get all active services.
- **Auth Required:** No
- **Query Params:** category (slug), featured (bool)
- **Response:** List[ServiceListResponse]

### GET /api/services/{service_id}
Get service details.
- **Auth Required:** No
- **Response:** ServiceResponse

### GET /api/services/add-ons/
Get all add-ons.
- **Auth Required:** No
- **Response:** List[AddOnResponse]

### POST /api/services/calculate-price
Calculate booking price.
- **Auth Required:** No
- **Request Body:**
```json
{
  "service_id": 1,
  "property_size_sqft": 1500,
  "bedrooms": 2,
  "bathrooms": 2,
  "add_on_ids": [1, 2, 5],
  "discount_code": "SAVE10"
}
```
- **Response:** PriceCalculationResponse

### POST /api/services/validate-discount
Validate discount code.
- **Auth Required:** No
- **Request Body:**
```json
{
  "code": "SAVE10",
  "service_id": 1,
  "subtotal": 199.00
}
```

### POST /api/services/ (Admin)
Create new service.
- **Auth Required:** Yes (Admin)

### PUT /api/services/{service_id} (Admin)
Update service.
- **Auth Required:** Yes (Admin)

### DELETE /api/services/{service_id} (Admin)
Deactivate service.
- **Auth Required:** Yes (Admin)

---

## Booking Endpoints

### POST /api/bookings/
Create new booking.
- **Auth Required:** Yes (Customer+)
- **Request Body:**
```json
{
  "service_id": 1,
  "address_id": 1,
  "scheduled_date": "2024-02-15T10:00:00Z",
  "property_size_sqft": 1500,
  "bedrooms": 2,
  "bathrooms": 2,
  "add_on_ids": [1, 5],
  "customer_notes": "Please use eco-friendly products",
  "discount_code": "FIRST10"
}
```
- **Response:** BookingResponse

### GET /api/bookings/
Get user's bookings.
- **Auth Required:** Yes (Customer+)
- **Query Params:** status, skip, limit
- **Response:** List[BookingListResponse]

### GET /api/bookings/{booking_id}
Get booking details.
- **Auth Required:** Yes (Owner/Admin)
- **Response:** BookingResponse

### PUT /api/bookings/{booking_id}/cancel
Cancel booking.
- **Auth Required:** Yes (Owner/Admin)
- **Request Body:**
```json
{
  "reason": "Schedule conflict",
  "request_refund": true
}
```

### PUT /api/bookings/{booking_id}/reschedule
Reschedule booking.
- **Auth Required:** Yes (Owner/Admin)
- **Request Body:**
```json
{
  "new_date": "2024-02-20T14:00:00Z",
  "reason": "Preferred afternoon slot"
}
```

### GET /api/bookings/admin/all (Admin)
List all bookings.
- **Auth Required:** Yes (Admin)
- **Query Params:** status, payment_status, from_date, to_date, search

### PUT /api/bookings/admin/{booking_id}/status (Admin)
Update booking status.
- **Auth Required:** Yes (Admin)
- **Request Body:**
```json
{
  "status": "confirmed",
  "reason": "Payment verified"
}
```

### PUT /api/bookings/admin/{booking_id}/assign (Admin)
Assign cleaner to booking.
- **Auth Required:** Yes (Admin)
- **Request Body:**
```json
{
  "cleaner_id": 5
}
```

### GET /api/bookings/admin/stats (Admin)
Get booking statistics.
- **Auth Required:** Yes (Admin)
- **Response:**
```json
{
  "total_bookings": 150,
  "pending_bookings": 12,
  "confirmed_bookings": 25,
  "completed_bookings": 108,
  "total_customers": 89,
  "total_revenue": 15420.00
}
```

---

## Payment Endpoints

### POST /api/payments/checkout
Create Stripe checkout session.
- **Auth Required:** Yes (Customer+)
- **Request Body:**
```json
{
  "booking_id": 123,
  "origin_url": "https://brighthome.com"
}
```
- **Response:**
```json
{
  "checkout_url": "https://checkout.stripe.com/...",
  "session_id": "cs_test_..."
}
```

### GET /api/payments/status/{session_id}
Verify payment status.
- **Auth Required:** Yes (Owner/Admin)
- **Response:**
```json
{
  "status": "complete",
  "payment_status": "paid",
  "booking_id": 123,
  "amount": 199.00
}
```

### GET /api/payments/booking/{booking_id}
Get payment for booking.
- **Auth Required:** Yes (Owner/Admin)
- **Response:** PaymentStatusResponse

### POST /api/payments/refund (Admin)
Create refund.
- **Auth Required:** Yes (Admin)
- **Request Body:**
```json
{
  "payment_id": 45,
  "amount": 50.00,
  "reason": "Partial refund - service issue"
}
```

### POST /api/payments/webhook/stripe
Stripe webhook handler.
- **Auth Required:** No (Stripe signature verified)

---

## Review Endpoints

### POST /api/reviews/
Create review for completed booking.
- **Auth Required:** Yes (Customer+)
- **Request Body:**
```json
{
  "booking_id": 123,
  "overall_rating": 5,
  "cleanliness_rating": 5,
  "punctuality_rating": 4,
  "communication_rating": 5,
  "value_rating": 4,
  "title": "Excellent service!",
  "comment": "The team was professional and thorough..."
}
```

### GET /api/reviews/
Get public reviews.
- **Auth Required:** No
- **Query Params:** service_id, min_rating, skip, limit
- **Response:** List[ReviewResponse]

### GET /api/reviews/stats
Get review statistics.
- **Auth Required:** No
- **Query Params:** service_id
- **Response:** ReviewStats

### PUT /api/reviews/admin/{review_id}/respond (Admin)
Add admin response to review.
- **Auth Required:** Yes (Admin)

### PUT /api/reviews/admin/{review_id}/publish (Admin)
Publish/unpublish review.
- **Auth Required:** Yes (Admin)

---

## Contact Endpoints

### POST /api/contact/
Submit contact form.
- **Auth Required:** No
- **Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+14155551234",
  "subject": "Question about services",
  "message": "I would like to know..."
}
```

### GET /api/contact/admin (Admin)
List contact messages.
- **Auth Required:** Yes (Admin)
- **Query Params:** status

### POST /api/contact/admin/{message_id}/reply (Admin)
Reply to message.
- **Auth Required:** Yes (Admin)

---

## Error Responses

All endpoints return consistent error format:
```json
{
  "detail": "Error message here"
}
```

### Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 422: Validation Error
- 500: Internal Server Error
