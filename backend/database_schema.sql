-- BrightHome Cleaning Services
-- PostgreSQL Database Schema
-- Version 1.0

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE user_role AS ENUM ('customer', 'cleaner', 'admin');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled', 'refunded', 'no_show');
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'paid', 'failed', 'refunded', 'partially_refunded');
CREATE TYPE payment_method AS ENUM ('card', 'bank_transfer', 'crypto');
CREATE TYPE refund_status AS ENUM ('pending', 'processing', 'completed', 'failed');

-- ============================================
-- USERS & AUTHENTICATION
-- ============================================

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    role user_role NOT NULL DEFAULT 'customer',
    status user_status NOT NULL DEFAULT 'active',
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(100),
    password_reset_token VARCHAR(100),
    password_reset_expires TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

CREATE TABLE refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    revoked_at TIMESTAMPTZ
);

CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);

CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label VARCHAR(50) DEFAULT 'Home',
    street_address VARCHAR(255) NOT NULL,
    apartment VARCHAR(50),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) DEFAULT 'USA',
    property_type VARCHAR(50),
    property_size_sqft INTEGER,
    bedrooms INTEGER,
    bathrooms INTEGER,
    is_default BOOLEAN DEFAULT FALSE,
    access_instructions TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_addresses_user ON addresses(user_id);

-- ============================================
-- SERVICES & CATALOG
-- ============================================

CREATE TABLE service_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_service_categories_slug ON service_categories(slug);

CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL REFERENCES service_categories(id),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    short_description VARCHAR(255),
    description TEXT,
    icon VARCHAR(50),
    image_url VARCHAR(500),
    base_price DECIMAL(10,2) NOT NULL,
    price_per_sqft DECIMAL(10,4) DEFAULT 0,
    price_per_bedroom DECIMAL(10,2) DEFAULT 0,
    price_per_bathroom DECIMAL(10,2) DEFAULT 0,
    base_duration_hours DECIMAL(4,2) NOT NULL,
    duration_per_sqft_hours DECIMAL(6,4) DEFAULT 0,
    features TEXT, -- JSON array
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_services_slug ON services(slug);
CREATE INDEX idx_services_category ON services(category_id);
CREATE INDEX idx_services_active ON services(is_active);

CREATE TABLE add_ons (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration_hours DECIMAL(4,2) DEFAULT 0,
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_add_ons_slug ON add_ons(slug);

-- ============================================
-- BOOKINGS
-- ============================================

CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    booking_number VARCHAR(20) NOT NULL UNIQUE,
    customer_id INTEGER NOT NULL REFERENCES users(id),
    cleaner_id INTEGER REFERENCES users(id),
    service_id INTEGER NOT NULL REFERENCES services(id),
    address_id INTEGER NOT NULL REFERENCES addresses(id),
    scheduled_date TIMESTAMPTZ NOT NULL,
    scheduled_end_time TIMESTAMPTZ,
    actual_start_time TIMESTAMPTZ,
    actual_end_time TIMESTAMPTZ,
    property_size_sqft INTEGER NOT NULL,
    bedrooms INTEGER DEFAULT 0,
    bathrooms INTEGER DEFAULT 1,
    base_price DECIMAL(10,2) NOT NULL,
    size_adjustment DECIMAL(10,2) DEFAULT 0,
    add_ons_total DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total_price DECIMAL(10,2) NOT NULL,
    discount_code VARCHAR(50),
    status booking_status NOT NULL DEFAULT 'pending',
    payment_status payment_status NOT NULL DEFAULT 'pending',
    customer_notes TEXT,
    internal_notes TEXT,
    cleaner_notes TEXT,
    cancelled_at TIMESTAMPTZ,
    cancelled_by_id INTEGER REFERENCES users(id),
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bookings_number ON bookings(booking_number);
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_cleaner ON bookings(cleaner_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX idx_bookings_scheduled ON bookings(scheduled_date);

CREATE TABLE booking_add_ons (
    booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    add_on_id INTEGER NOT NULL REFERENCES add_ons(id) ON DELETE CASCADE,
    price_at_booking DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (booking_id, add_on_id)
);

CREATE TABLE booking_status_history (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    previous_status booking_status,
    new_status booking_status NOT NULL,
    changed_by_id INTEGER REFERENCES users(id),
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_booking_history_booking ON booking_status_history(booking_id);

CREATE TABLE time_slots (
    id SERIAL PRIMARY KEY,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time VARCHAR(5) NOT NULL,
    end_time VARCHAR(5) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    max_bookings INTEGER DEFAULT 3,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PAYMENTS
-- ============================================

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL UNIQUE REFERENCES bookings(id),
    stripe_session_id VARCHAR(255) UNIQUE,
    stripe_payment_intent_id VARCHAR(255) UNIQUE,
    stripe_charge_id VARCHAR(255),
    stripe_customer_id VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method payment_method DEFAULT 'card',
    status payment_status NOT NULL DEFAULT 'pending',
    card_last_four VARCHAR(4),
    card_brand VARCHAR(20),
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_payments_session ON payments(stripe_session_id);
CREATE INDEX idx_payments_status ON payments(status);

CREATE TABLE refunds (
    id SERIAL PRIMARY KEY,
    payment_id INTEGER NOT NULL REFERENCES payments(id),
    stripe_refund_id VARCHAR(255) UNIQUE,
    amount DECIMAL(10,2) NOT NULL,
    reason TEXT,
    status refund_status NOT NULL DEFAULT 'pending',
    initiated_by_id INTEGER REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

CREATE INDEX idx_refunds_payment ON refunds(payment_id);

CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    invoice_number VARCHAR(20) NOT NULL UNIQUE,
    booking_id INTEGER NOT NULL REFERENCES bookings(id),
    customer_id INTEGER NOT NULL REFERENCES users(id),
    subtotal DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0,
    tax DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'draft',
    issue_date TIMESTAMPTZ DEFAULT NOW(),
    due_date TIMESTAMPTZ,
    paid_date TIMESTAMPTZ,
    pdf_url VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_invoices_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_customer ON invoices(customer_id);

CREATE TABLE discount_codes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL, -- 'percentage' or 'fixed'
    discount_value DECIMAL(10,2) NOT NULL,
    min_order_amount DECIMAL(10,2) DEFAULT 0,
    max_discount_amount DECIMAL(10,2),
    max_uses INTEGER,
    uses_count INTEGER DEFAULT 0,
    max_uses_per_user INTEGER DEFAULT 1,
    valid_from TIMESTAMPTZ,
    valid_until TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    applicable_service_ids TEXT, -- JSON array or comma-separated
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_discount_codes_code ON discount_codes(code);

-- ============================================
-- REVIEWS & FEEDBACK
-- ============================================

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL UNIQUE REFERENCES bookings(id),
    customer_id INTEGER NOT NULL REFERENCES users(id),
    cleaner_id INTEGER REFERENCES users(id),
    overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
    cleanliness_rating INTEGER CHECK (cleanliness_rating IS NULL OR (cleanliness_rating >= 1 AND cleanliness_rating <= 5)),
    punctuality_rating INTEGER CHECK (punctuality_rating IS NULL OR (punctuality_rating >= 1 AND punctuality_rating <= 5)),
    communication_rating INTEGER CHECK (communication_rating IS NULL OR (communication_rating >= 1 AND communication_rating <= 5)),
    value_rating INTEGER CHECK (value_rating IS NULL OR (value_rating >= 1 AND value_rating <= 5)),
    title VARCHAR(200),
    comment TEXT,
    response TEXT,
    response_at TIMESTAMPTZ,
    response_by_id INTEGER REFERENCES users(id),
    is_verified BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reviews_booking ON reviews(booking_id);
CREATE INDEX idx_reviews_customer ON reviews(customer_id);
CREATE INDEX idx_reviews_published ON reviews(is_published);

CREATE TABLE contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'new',
    assigned_to_id INTEGER REFERENCES users(id),
    reply TEXT,
    replied_at TIMESTAMPTZ,
    replied_by_id INTEGER REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_contact_messages_status ON contact_messages(status);

-- ============================================
-- AUDIT & NOTIFICATIONS
-- ============================================

CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INTEGER,
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    old_values TEXT, -- JSON
    new_values TEXT, -- JSON
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    entity_type VARCHAR(50),
    entity_id INTEGER,
    channel VARCHAR(20) DEFAULT 'in_app',
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);

-- ============================================
-- SEED DATA
-- ============================================

-- Service Categories
INSERT INTO service_categories (name, slug, description, icon, display_order) VALUES
('Residential', 'residential', 'Home cleaning services', 'Home', 1),
('Commercial', 'commercial', 'Office and business cleaning', 'Building', 2),
('Specialty', 'specialty', 'Specialized cleaning services', 'Sparkles', 3);

-- Services
INSERT INTO services (category_id, name, slug, short_description, description, icon, base_price, price_per_sqft, base_duration_hours, features, is_featured) VALUES
(1, 'Standard Cleaning', 'standard-cleaning', 'Essential cleaning for a fresh, tidy home', 'Our standard cleaning service covers all the essentials to keep your home fresh and tidy.', 'Sparkles', 99.00, 0.05, 2.5, '["Dusting & Wiping", "Vacuuming & Mopping", "Bathroom Sanitizing", "Kitchen Cleaning", "Trash Removal"]', true),
(1, 'Deep Cleaning', 'deep-cleaning', 'Thorough deep clean for every corner', 'A thorough, detailed clean that reaches every corner.', 'SprayCan', 199.00, 0.08, 4.0, '["All Standard Cleaning", "Baseboard Cleaning", "Light Fixture Cleaning", "Door & Frame Wiping", "Detailed Scrubbing"]', true),
(1, 'Move In/Out Cleaning', 'move-in-out-cleaning', 'Comprehensive cleaning for moving day', 'Make your move stress-free with our comprehensive cleaning.', 'Home', 249.00, 0.10, 5.0, '["All Deep Cleaning", "Inside Cabinets", "Inside Appliances", "Window Sills", "Garage Sweep"]', false),
(2, 'Office Cleaning', 'office-cleaning', 'Professional office & workspace cleaning', 'Professional cleaning for your workspace.', 'Building', 149.00, 0.04, 3.0, '["Desk & Surface Cleaning", "Floor Maintenance", "Restroom Sanitizing", "Break Room Cleaning", "Trash & Recycling"]', false),
(3, 'Post-Construction Cleaning', 'post-construction-cleaning', 'Detailed cleanup after renovation work', 'Remove construction dust and debris after renovation.', 'Hammer', 299.00, 0.12, 6.0, '["Dust Removal", "Debris Cleanup", "Surface Polishing", "Window Cleaning", "Final Detailing"]', false),
(3, 'Carpet & Upholstery Cleaning', 'carpet-upholstery-cleaning', 'Deep clean carpets and furniture', 'Professional deep cleaning for carpets and upholstered furniture.', 'Sofa', 129.00, 0.15, 2.0, '["Steam Cleaning", "Stain Treatment", "Odor Removal", "Fabric Protection", "Quick Dry"]', false);

-- Add-ons
INSERT INTO add_ons (name, slug, description, price, duration_hours, icon, display_order) VALUES
('Inside Fridge Cleaning', 'inside-fridge', 'Deep clean refrigerator interior', 35.00, 0.5, 'Refrigerator', 1),
('Inside Oven Cleaning', 'inside-oven', 'Degrease and clean oven interior', 45.00, 0.75, 'Flame', 2),
('Inside Cabinet Cleaning', 'inside-cabinets', 'Clean and organize cabinet interiors', 50.00, 1.0, 'Archive', 3),
('Laundry Service', 'laundry', 'Wash, dry, and fold laundry', 30.00, 1.0, 'Shirt', 4),
('Interior Windows', 'window-interior', 'Clean all interior windows', 40.00, 0.5, 'Square', 5),
('Balcony Cleaning', 'balcony', 'Sweep and mop balcony area', 25.00, 0.5, 'Sun', 6),
('Deep Carpet Clean', 'deep-carpet', 'Steam clean carpets', 75.00, 1.5, 'Layers', 7),
('Pet Hair Treatment', 'pet-treatment', 'Extra attention to pet hair removal', 35.00, 0.5, 'Dog', 8);

-- Admin User (password: admin123)
INSERT INTO users (email, password_hash, first_name, last_name, phone, role, status, email_verified) VALUES
('admin@brighthome.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4HlPtU4KNNpJPGEi', 'Admin', 'User', '+1234567890', 'admin', 'active', true);

-- Time Slots
INSERT INTO time_slots (day_of_week, start_time, end_time, max_bookings) VALUES
(1, '08:00', '09:00', 3), (1, '09:00', '10:00', 3), (1, '10:00', '11:00', 3),
(1, '11:00', '12:00', 3), (1, '13:00', '14:00', 3), (1, '14:00', '15:00', 3),
(1, '15:00', '16:00', 3), (1, '16:00', '17:00', 3),
(2, '08:00', '09:00', 3), (2, '09:00', '10:00', 3), (2, '10:00', '11:00', 3),
(2, '11:00', '12:00', 3), (2, '13:00', '14:00', 3), (2, '14:00', '15:00', 3),
(2, '15:00', '16:00', 3), (2, '16:00', '17:00', 3),
(3, '08:00', '09:00', 3), (3, '09:00', '10:00', 3), (3, '10:00', '11:00', 3),
(3, '11:00', '12:00', 3), (3, '13:00', '14:00', 3), (3, '14:00', '15:00', 3),
(3, '15:00', '16:00', 3), (3, '16:00', '17:00', 3),
(4, '08:00', '09:00', 3), (4, '09:00', '10:00', 3), (4, '10:00', '11:00', 3),
(4, '11:00', '12:00', 3), (4, '13:00', '14:00', 3), (4, '14:00', '15:00', 3),
(4, '15:00', '16:00', 3), (4, '16:00', '17:00', 3),
(5, '08:00', '09:00', 3), (5, '09:00', '10:00', 3), (5, '10:00', '11:00', 3),
(5, '11:00', '12:00', 3), (5, '13:00', '14:00', 3), (5, '14:00', '15:00', 3),
(5, '15:00', '16:00', 3), (5, '16:00', '17:00', 3),
(6, '09:00', '10:00', 2), (6, '10:00', '11:00', 2), (6, '11:00', '12:00', 2),
(6, '13:00', '14:00', 2), (6, '14:00', '15:00', 2);
