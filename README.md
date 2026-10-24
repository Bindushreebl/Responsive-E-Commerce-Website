# ShopEase Luxe — Responsive Full Stack E-Commerce Web Application

**ShopEase Luxe** is a production-grade, responsive Full Stack E-Commerce platform built using modern Web standards, featuring a React frontend with a Vanilla CSS design system, an Express.js REST API, and a MongoDB database.

---

## 🌟 Key Features & Requirements Checklist

### 1. Responsive Component Layout
- **Mobile-First & Adaptive Grids**: Flexible CSS Grid layouts (`grid-comfortable` and `grid-compact`) adapting gracefully from 320px mobile screens to ultra-wide desktop monitors.
- **Collapsible Mobile Navigation**: Mobile hamburger drawer with category navigation.
- **Slide-Over Shopping Drawer**: Smooth off-canvas drawer that handles items, quantity management, and responsive cart checkout on any viewport size.
- **Adaptive Modals**: Responsive dialogs for Product Details, Express Checkout, Order Confirmation, Wishlist, and Order Tracking.

### 2. Modern Aesthetics & CSS Handling
- **Vanilla CSS Design System**: Custom design tokens defined in `src/index.css` (variables for colors, gradients, elevation shadows, borders, radii, and transitions).
- **Glassmorphism**: Backdrop blur (`backdrop-filter: blur(...)`) and translucent surfaces for sticky navbar, drawer panels, and floating chips.
- **Dynamic Light & Dark Modes**: Instant theme toggle with full token switching and state saved to `localStorage`.
- **Micro-Animations**: Hover elevations, pulsing live status dots, button scale feedback, and floating badge movements.
- **Rich Typography**: Curated Google Fonts (*Outfit* for bold headings & *Plus Jakarta Sans* for readable body text).
- **Curated Visuals**: High-definition curated photography with custom styled fallback badges.

### 3. Frontend Logic & State Management
- **Interactive Shopping Cart**:
  - Add to cart from product cards, hero spotlight, or quick view modal.
  - Live quantity adjustment, item removal, and "Clear Cart".
  - Dynamic free delivery progress bar (tracks threshold of ₹999).
  - Discount promo code engine (`LUXE20`, `SAVE10`, `FREESHIP`) with real-time tax and total calculations.
  - Cart persistence via `localStorage`.
- **Wishlist & Bookmarks**: Save favorite items with animated heart toggles and one-click "Move to Cart".
- **Dynamic Filtering & Sorting**:
  - Instant live keyword search across names, categories, and descriptions.
  - Category selector pills with aggregate count badges.
  - Price range slider filter (₹500 to ₹5,000).
  - "In Stock Only" toggle switch.
  - Sort by: Featured, Price Low to High, Price High to Low, Highest Rated, and Newest.
- **Toast Notifications**: Floating feedback system for user actions.

### 4. Database Integration (MongoDB & Express)
- **Mongoose Data Models**:
  - `Product`: Catalog schema containing title, price, original price, ratings, reviews count, specs list, stock inventory, categories, and badge metadata.
  - `Order`: Transaction schema storing customer delivery address, cart item snapshots, pricing summary, payment method, transaction IDs, and order tracking status.
- **RESTful Endpoints**:
  - `GET /api/products`: Full catalog with server-side query filters.
  - `GET /api/products/:id`: Single product lookup with related recommendations.
  - `GET /api/categories`: Dynamic aggregation of categories and counts.
  - `POST /api/orders`: Validates and saves orders to MongoDB with unique `SE-XXXXXX-XXX` order codes.
  - `GET /api/orders`: Retrieves order history records.
  - `GET /api/health`: Database connection status and collection statistics.
- **Auto-Seeding**: Automatic seed verification on server startup so the store is pre-populated out-of-the-box.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Vanilla CSS3 (Custom Properties & CSS Grid/Flexbox)
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB (Local or MongoDB Atlas)
- **Fonts**: Google Fonts (*Outfit*, *Plus Jakarta Sans*)

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- MongoDB running locally on `mongodb://127.0.0.1:27017` (or MongoDB Atlas connection string)

### 1. Backend Setup
```bash
cd backend
npm install
# Start backend server (runs on http://localhost:5000)
npm start
```
*Optional: To re-seed the product catalog at any time:*
```bash
npm run seed
```

### 2. Frontend Setup
```bash
cd frontend
npm install
# Start frontend dev server (runs on http://localhost:5173)
npm run dev
```

Open `http://localhost:5173/` in your browser.

---

## 📡 API Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Check API & database connection status |
| `GET` | `/api/products` | Get products (supports `?category=...&search=...&sort=...`) |
| `GET` | `/api/products/:id` | Get single product and related recommendations |
| `GET` | `/api/categories` | Get all categories with product counts |
| `POST` | `/api/orders` | Place a new order and persist to MongoDB |
| `GET` | `/api/orders` | Retrieve list of placed orders |
| `POST` | `/api/seed` | Reset and re-seed sample catalog |

---

## 🎨 Tested Flow & Scenarios
- [x] Product browsing across multiple categories
- [x] Instant search & price slider filtering
- [x] Quick view modal with quantity selector and "Buy Now" flow
- [x] Add to cart with animated toast notification
- [x] Slide-over cart drawer with promo code calculation
- [x] Multi-step checkout with delivery address and payment selection
- [x] Order placed and verified in MongoDB database
- [x] Order history verification in UI
- [x] Theme toggle between Dark and Light mode
- [x] Responsive layout verified on desktop and mobile viewports


