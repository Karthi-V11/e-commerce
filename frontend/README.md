# ShopSphere — Frontend (React)

Vite + React 18 + Redux Toolkit + Tailwind CSS + React Router. Talks to the ShopSphere Spring Boot backend.

## Stack
- React 18 + Vite
- React Router v6
- Redux Toolkit (auth, cart, products, ui slices)
- Axios with a JWT access/refresh-token interceptor
- Tailwind CSS (custom theme: primary/accent palette, glassmorphism utility, card shadows)
- Material UI + lucide-react available for icons/components
- react-hot-toast for notifications

## Structure
```
src/
  api/            axios client with auto refresh-token handling
  app/            Redux store + ui slice (dark mode)
  features/       auth/, cart/, products/ Redux slices
  components/
    layout/       Navbar, Footer
    common/       ProductCard, ProtectedRoute, Skeleton
  pages/          route-level screens
    seller/       SellerDashboard
    admin/        AdminDashboard
  App.jsx         route table
  main.jsx        entry point
```

## Run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and point it at your running backend:
   ```
   VITE_API_BASE_URL=http://localhost:8080/api
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
   App runs at `http://localhost:5173`. The Vite dev server also proxies `/api` to `localhost:8080` if you prefer relative calls.

Requires the backend running (see the backend README for setup + seed accounts).

## What's fully implemented
- **Auth**: login, register, JWT stored in localStorage, automatic silent refresh on 401 via axios interceptor, protected routes with role checks
- **Landing page**: hero, featured categories, trending products (live from API), newsletter form (UI only)
- **Product browsing**: search, sort, pagination ("load more"), product detail with image gallery, add-to-cart, reviews display
- **Cart**: add/update/remove, quantity stepper, live subtotal
- **Checkout**: address selection + creation, payment method picker (mock), coupon code field, order placement
- **Order success / order history**: full order detail, status badges
- **Profile**: tabbed layout (info, addresses, orders, wishlist, security, notifications) — info/addresses/orders are live; wishlist/notifications show a clear "not wired up yet" note matching the backend's current scope
- **Seller dashboard**: product CRUD table + form, basic stats
- **Admin dashboard**: order list with inline status updates, basic stats
- **Dark mode** toggle (persisted), responsive layout (mobile menu in navbar), loading skeletons, toast notifications, custom 404 page

## What's stubbed or not yet built
Per the backend's current scope, these have **no live data** in the UI yet — they're straightforward to add once the corresponding backend endpoints exist (wishlist/notifications tables are already in the DB schema):
- Wishlist page/functionality
- Notifications panel
- Forgot/reset password flow (links exist, pages don't)
- Category browsing page (category links currently route into `/products` with a filter param that the backend doesn't yet parse — wire up `categorySlug`/`categoryId` support server-side to make this live)
- Seller analytics/revenue charts (dashboard shows basic counts only, no chart library wired in)
- Admin user/seller/category/coupon management screens (order management is the only fully wired admin screen)

## Notes
- This wasn't run through `npm install && npm run build` in this sandbox (no network path to npm registry from here in this environment), so treat it the same way as the backend: structurally consistent and hand-verified for brace/paren balance, but do a local `npm install` as your first real smoke test.
- Tailwind's `darkMode: 'class'` is toggled on `<html>` via the `ui` Redux slice — check `App.jsx` if you rewire dark mode logic.
