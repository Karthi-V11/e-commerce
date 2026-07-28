-- ==============================================================
-- ShopSphere Core Schema (V1)
-- Scope implemented in this scaffold: users/roles, categories,
-- products, images, cart, orders, reviews, refresh tokens.
-- Tables listed in the spec but not yet wired to code (inventory,
-- coupons, notifications, wishlist, audit_logs, permissions) are
-- included as forward-compatible structures where cheap to add,
-- and noted in README as "schema-only / not yet serviced".
-- ==============================================================

CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE  -- ROLE_CUSTOMER, ROLE_SELLER, ROLE_ADMIN
);

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    profile_image_url VARCHAR(500),
    is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE user_roles (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE refresh_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE addresses (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label VARCHAR(50),
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    line1 VARCHAR(255) NOT NULL,
    line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(170) NOT NULL UNIQUE,
    description TEXT,
    parent_id BIGINT REFERENCES categories(id),
    image_url VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    seller_id BIGINT NOT NULL REFERENCES users(id),
    category_id BIGINT NOT NULL REFERENCES categories(id),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(280) NOT NULL UNIQUE,
    brand VARCHAR(150),
    description TEXT,
    specifications JSONB,
    price NUMERIC(12,2) NOT NULL CHECK (price >= 0),
    discount_price NUMERIC(12,2) CHECK (discount_price >= 0),
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    average_rating NUMERIC(3,2) NOT NULL DEFAULT 0,
    review_count INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_seller ON products(seller_id);
CREATE INDEX idx_products_name_trgm ON products USING gin (to_tsvector('english', name));

CREATE TABLE product_images (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE cart (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE cart_items (
    id BIGSERIAL PRIMARY KEY,
    cart_id BIGINT NOT NULL REFERENCES cart(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id),
    quantity INT NOT NULL CHECK (quantity > 0),
    saved_for_later BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    UNIQUE (cart_id, product_id)
);

CREATE TABLE wishlist (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE wishlist_items (
    id BIGSERIAL PRIMARY KEY,
    wishlist_id BIGINT NOT NULL REFERENCES wishlist(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id),
    added_at TIMESTAMP NOT NULL DEFAULT now(),
    UNIQUE (wishlist_id, product_id)
);

CREATE TABLE coupons (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    discount_type VARCHAR(20) NOT NULL,   -- PERCENTAGE | FLAT
    discount_value NUMERIC(12,2) NOT NULL,
    min_order_value NUMERIC(12,2) DEFAULT 0,
    max_uses INT,
    used_count INT NOT NULL DEFAULT 0,
    valid_from TIMESTAMP NOT NULL,
    valid_until TIMESTAMP NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    order_number VARCHAR(30) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL REFERENCES users(id),
    shipping_address_id BIGINT NOT NULL REFERENCES addresses(id),
    billing_address_id BIGINT NOT NULL REFERENCES addresses(id),
    coupon_id BIGINT REFERENCES coupons(id),
    subtotal NUMERIC(12,2) NOT NULL,
    discount_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    shipping_fee NUMERIC(12,2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(12,2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    -- PENDING, CONFIRMED, PACKED, SHIPPED, OUT_FOR_DELIVERY, DELIVERED, CANCELLED, RETURNED
    payment_method VARCHAR(30) NOT NULL,
    -- CREDIT_CARD, UPI, NET_BANKING, WALLET, COD
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);

CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id),
    seller_id BIGINT NOT NULL REFERENCES users(id),
    product_name_snapshot VARCHAR(255) NOT NULL,
    unit_price NUMERIC(12,2) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    line_total NUMERIC(12,2) NOT NULL
);

CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    method VARCHAR(30) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- PENDING, SUCCESS, FAILED
    transaction_ref VARCHAR(100),
    amount NUMERIC(12,2) NOT NULL,
    paid_at TIMESTAMP
);

CREATE TABLE reviews (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id),
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title VARCHAR(150),
    comment TEXT,
    is_verified_purchase BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    UNIQUE (product_id, user_id)
);

CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(30) NOT NULL,  -- ORDER_UPDATE, PROMOTION, WISHLIST_ALERT, STOCK_ALERT
    title VARCHAR(200) NOT NULL,
    message VARCHAR(500) NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id BIGINT,
    details JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);
