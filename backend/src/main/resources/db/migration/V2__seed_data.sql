INSERT INTO roles (name) VALUES ('ROLE_CUSTOMER'), ('ROLE_SELLER'), ('ROLE_ADMIN');

-- password for all seed users is: Password123!  (BCrypt hash below)
INSERT INTO users (first_name, last_name, email, password_hash, is_email_verified, is_enabled)
VALUES
 ('Admin', 'User', 'admin@shopsphere.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoOhi5R4iVGB6E8xR/o3JeQfXPmA9lYym6', true, true),
 ('Sam', 'Seller', 'seller@shopsphere.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoOhi5R4iVGB6E8xR/o3JeQfXPmA9lYym6', true, true),
 ('Casey', 'Customer', 'customer@shopsphere.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoOhi5R4iVGB6E8xR/o3JeQfXPmA9lYym6', true, true);

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.email = 'admin@shopsphere.com' AND r.name = 'ROLE_ADMIN';
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.email = 'seller@shopsphere.com' AND r.name = 'ROLE_SELLER';
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.email = 'customer@shopsphere.com' AND r.name = 'ROLE_CUSTOMER';

INSERT INTO categories (name, slug, description) VALUES
 ('Electronics', 'electronics', 'Phones, laptops, gadgets and more'),
 ('Fashion', 'fashion', 'Clothing, footwear and accessories'),
 ('Home & Kitchen', 'home-kitchen', 'Furniture, decor and appliances'),
 ('Books', 'books', 'Fiction, non-fiction and academic'),
 ('Sports & Outdoors', 'sports-outdoors', 'Fitness and outdoor gear');

INSERT INTO products (seller_id, category_id, name, slug, brand, description, price, discount_price, stock_quantity)
SELECT u.id, c.id, 'Wireless Noise-Cancelling Headphones', 'wireless-noise-cancelling-headphones', 'AudioMax',
       'Premium over-ear headphones with active noise cancellation and 30-hour battery life.',
       199.99, 149.99, 120
FROM users u, categories c WHERE u.email = 'seller@shopsphere.com' AND c.slug = 'electronics';

INSERT INTO products (seller_id, category_id, name, slug, brand, description, price, discount_price, stock_quantity)
SELECT u.id, c.id, 'Smart Fitness Watch', 'smart-fitness-watch', 'FitPulse',
       'Track workouts, heart rate and sleep with this premium smart watch.',
       249.99, 199.99, 80
FROM users u, categories c WHERE u.email = 'seller@shopsphere.com' AND c.slug = 'electronics';

INSERT INTO products (seller_id, category_id, name, slug, brand, description, price, stock_quantity)
SELECT u.id, c.id, 'Classic Leather Backpack', 'classic-leather-backpack', 'Urbanite',
       'Handcrafted genuine leather backpack, perfect for work and travel.',
       89.99, 45
FROM users u, categories c WHERE u.email = 'seller@shopsphere.com' AND c.slug = 'fashion';

INSERT INTO product_images (product_id, image_url, display_order, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e', 0, true FROM products WHERE slug = 'wireless-noise-cancelling-headphones';
INSERT INTO product_images (product_id, image_url, display_order, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30', 0, true FROM products WHERE slug = 'smart-fitness-watch';
INSERT INTO product_images (product_id, image_url, display_order, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62', 0, true FROM products WHERE slug = 'classic-leather-backpack';

INSERT INTO coupons (code, description, discount_type, discount_value, min_order_value, valid_from, valid_until)
VALUES ('WELCOME10', '10% off your first order', 'PERCENTAGE', 10, 20, now(), now() + interval '1 year');
