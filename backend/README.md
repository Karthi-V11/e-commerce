# ShopSphere — Backend (Spring Boot)

Enterprise e-commerce REST API. Java 21, Spring Boot 3.3, PostgreSQL, JWT auth, Flyway, MapStruct, Swagger.

## Stack
- Spring Boot 3.3 (Web, Security, Data JPA, Validation)
- PostgreSQL + Flyway migrations
- JWT (access + refresh token) auth via `jjwt`
- MapStruct for entity → DTO mapping
- Lombok
- springdoc-openapi (Swagger UI)

## Architecture
Layered: `Controller → Service (interface + impl) → Repository → Entity`.
Controllers never touch entities directly — only DTOs cross the API boundary.

```
controller/   REST endpoints
service/      business logic interfaces + impl/
repository/   Spring Data JPA repositories
entity/       JPA entities
dto/          request/ and response/ DTOs
mapper/       MapStruct mappers
security/     JWT filter, UserDetails, JwtService
config/       SecurityConfig, OpenAPI, JPA auditing
exception/    Custom exceptions + @RestControllerAdvice
```

## Run locally

1. Start PostgreSQL (or use the included docker-compose in the repo root once you add the frontend service too):
   ```bash
   docker run -d --name shopsphere-db -e POSTGRES_DB=shopsphere \
     -e POSTGRES_USER=shopsphere -e POSTGRES_PASSWORD=shopsphere \
     -p 5432:5432 postgres:16
   ```
2. Copy `.env.example` to `.env` and adjust if needed (values also have sane defaults baked into `application.yml`).
3. Run (requires Maven 3.9+ and JDK 21 installed locally — no wrapper is bundled):
   ```bash
   mvn spring-boot:run
   ```
   Or generate a wrapper first with `mvn -N wrapper:wrapper` and use `./mvnw spring-boot:run`.
4. API base: `http://localhost:8080/api`
5. Swagger UI: `http://localhost:8080/api/swagger-ui.html`

Flyway runs migrations automatically on startup (`V1__init_schema.sql`, `V2__seed_data.sql`), seeding roles, an admin/seller/customer account, categories, and a few sample products.

### Seed accounts (password for all: `Password123!`)
- `admin@shopsphere.com` — ROLE_ADMIN
- `seller@shopsphere.com` — ROLE_SELLER
- `customer@shopsphere.com` — ROLE_CUSTOMER

## What's fully implemented
- JWT auth: register, login, refresh, logout (access token 15 min, refresh token 7 days, stored in `refresh_tokens` table)
- Role-based authorization (`ROLE_CUSTOMER`, `ROLE_SELLER`, `ROLE_ADMIN`) via Spring Security
- Product catalog: search with keyword/category/price filters, sorting, pagination (JPA Specifications)
- Categories
- Cart: add/update/remove items, save-for-later, stock validation
- Addresses (CRUD)
- Checkout → Order creation with coupon support, mock payment record, stock decrement, cart clearing
- Order history, order detail, admin order status updates (PENDING → CONFIRMED → ... → DELIVERED/CANCELLED/RETURNED)
- Reviews with rating aggregation back onto the product
- Seller product CRUD (create/update/soft-delete, scoped to the authenticated seller)
- Admin: list all orders, update order status
- Global exception handling → consistent JSON error shape
- Swagger/OpenAPI docs with bearer-auth scheme

## What's schema-only / not yet wired to endpoints
The database migration includes tables for `wishlist`, `wishlist_items`, `notifications`, and `audit_logs` (per the original spec) — these are ready for a repository/service/controller layer but don't have one yet in this pass. `coupons` has a full validation flow in checkout, but no admin CRUD endpoints for creating/editing them yet (they're seeded via SQL). These are natural next additions on top of the existing patterns (copy the `Review` or `Address` slice as a template).

## Notes
- Passwords are BCrypt-hashed; the JWT secret in `application.yml` is a placeholder — **rotate it before any real deployment**.
- Payment is fully mocked (`PaymentServiceImpl` logic lives inline in `OrderServiceImpl.checkout`) — no real gateway is integrated, per spec.
- This was hand-written to compile cleanly but has **not** been verified against a live Maven Central + PostgreSQL environment in this sandbox (outbound network here doesn't reach Maven Central). Run `./mvnw clean compile` locally as your first step — if anything surfaces, it'll most likely be a missing import or a minor MapStruct annotation-processor hiccup, not a structural issue.
