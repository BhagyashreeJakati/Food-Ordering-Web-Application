# 🍕 Foody — Professional Food Delivery Web Application

A production-quality full-stack food delivery app built with **React 18 + Spring Boot 3**, inspired by Zomato.

---

## ✨ Complete Feature List

### Customer Features
- 🏠 **Home** — Hero carousel, clickable offer banners with coupon codes, category chips (Biryani/Pizza/Burgers etc.), filter & sort bar (rating/delivery time/open now/veg-only)
- 🍽️ **Restaurant Detail** — Cover image, rating, opening hours, veg/non-veg filter, category filter, full menu with ADD/+/- controls and toast notifications
- 🛒 **Cart** — Live item count badge, quantity controls, 5 working coupon codes, live bill calculation (items + delivery + GST)
- 💳 **3-Step Checkout** — Address → Review order → Razorpay payment
- ✅ **Order Confirmation** — Real order items from API, payment ID, progress tracker
- 📍 **Order Tracking** — Live status timeline, auto-refreshes every 30s, ETA, cancel option
- 👤 **Profile** — My Orders (filter: all/active/delivered), Favourites, Saved Addresses, Order History

### Admin Features
- 🏪 **Restaurant Profile** — Toggle open/closed status
- 📋 **Menu Management** — Add food items with image, veg/non-veg toggle, category, delete/availability toggle
- 📦 **Orders Dashboard** — Real-time order table, dropdown status update (PENDING → OUT_FOR_DELIVERY → DELIVERED)
- 📊 **Analytics** — Revenue bar chart (last 7 days), order status breakdown, top-selling items

### Technical Features
- JWT authentication with token expiry handling
- Dark/light mode (persists across reloads)
- 404 Not Found page with food-themed message
- Skeleton loading cards while restaurants load
- Footer with company info
- Razorpay demo mode (works without real keys)

---

## 🛠️ Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| Java JDK | 17+ | https://adoptium.net |
| Maven | bundled | use `./mvnw` |
| MySQL | 8.0+ | https://dev.mysql.com/downloads |
| Node.js | 18+ | https://nodejs.org |

---

## ⚙️ Setup — 3 Steps

### Step 1 — Configure database & payment

Edit `FoodOrderingService/src/main/resources/application.properties`:

```properties
spring.datasource.password=YOUR_MYSQL_PASSWORD

# Optional: get free test keys at dashboard.razorpay.com → Settings → API Keys
razorpay.api.secret=YOUR_RAZORPAY_SECRET
```

> **Without Razorpay keys:** The app runs in demo mode — checkout redirects directly to the success page. Perfect for presentations!

### Step 2 — Start backend

```bash
cd FoodOrderingService
./mvnw spring-boot:run
```
**Windows:** `mvnw.cmd spring-boot:run`

✅ Starts at **http://localhost:8080**

Wait for: `SEEDING COMPLETE - 6 restaurants added`

### Step 3 — Start frontend

```bash
cd foodorderingclient
npm install
npm start
```

✅ Opens at **http://localhost:3000**

---

## 🔑 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Restaurant Owner (Admin) | admin@foody.com | password |
| Alternative Admin | zomato_admin@example.com | password |
| Customer | Register a new account | — |

**For Admin dashboard:** Login with admin@foody.com → go to http://localhost:3000/admin

---

## 🧪 Test Payment

| Field | Value |
|-------|-------|
| Card Number | 4111 1111 1111 1111 |
| Expiry | Any future date (e.g. 12/26) |
| CVV | Any 3 digits (e.g. 123) |

---

## 🎟️ Coupon Codes

| Code | Discount | Min Order |
|------|----------|-----------|
| WELCOME50 | 50% off up to ₹100 | None |
| FREESHIP | Free delivery | None |
| FEAST75 | ₹75 off | ₹299 |
| SAVE100 | ₹100 off | ₹499 |
| NEWUSER | 30% off up to ₹80 | None |

---

## 📁 Project Structure

```
foody-final/
├── FoodOrderingService/          ← Spring Boot Backend (Java 17)
│   └── src/main/java/.../
│       ├── config/               ← JWT, Security, CORS, DatabaseSeeder
│       ├── controller/           ← REST API endpoints
│       ├── service/              ← Business logic
│       ├── model/                ← JPA entities (User, Restaurant, Food, Order...)
│       └── repository/           ← Spring Data JPA repositories
│
└── foodorderingclient/           ← React 18 Frontend
    └── src/
        ├── pages/
        │   ├── home/             ← Home with hero, filters, restaurant grid
        │   ├── Restaurant/       ← Detail page with full menu
        │   ├── Cart/             ← Cart + PaymentSuccess
        │   ├── Checkout/         ← 3-step checkout wizard
        │   ├── OrderTracking/    ← Live order tracking
        │   ├── Profile/          ← Orders, Favourites, Addresses
        │   ├── Admin/            ← Dashboard, Food, Orders, Analytics
        │   └── NotFound/         ← 404 page
        ├── components/
        │   ├── NavBar.jsx        ← Search, cart badge, dark mode toggle
        │   ├── MenuCard.jsx      ← Veg indicator, inline +/- controls
        │   └── Footer.jsx        ← Company footer
        └── redux/slices/         ← Auth, Cart, Restaurant state
```

---

## 🔑 Key API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/user/register` | Register new user |
| POST | `/api/v1/user/login` | Login → returns JWT |
| GET | `/api/v1/user/profile` | Get authenticated user |
| GET | `/api/v1/restaurants` | All restaurants |
| GET | `/api/v1/restaurants/search?keyword=X` | Search restaurants |
| GET | `/api/v1/foods/restaurant/:id` | Restaurant menu |
| POST | `/api/v1/orders` | Place order |
| GET | `/api/v1/orders/user` | My order history |
| DELETE | `/api/v1/orders/:id/cancel` | Cancel order |
| POST | `/api/v1/payments/:orderId` | Get Razorpay payment link |
| GET | `/api/v1/admin/orders/restaurant/:id` | Admin: get orders |
| PUT | `/api/v1/admin/orders/:id/:status` | Admin: update order status |

---

## ⚠️ Troubleshooting

| Problem | Fix |
|---------|-----|
| Backend won't start | Check MySQL is running on port 3306; verify password in application.properties |
| "No restaurants found" | Backend seeder runs once on first start — watch console for "SEEDING COMPLETE" |
| Payment gives BAD_REQUEST | App runs in demo mode automatically — checkout will still complete |
| CORS error | Ensure backend is running before opening frontend |
| Port 3306 error | If your MySQL runs on 3310, change the URL in application.properties |

---

*Built for college project presentation — Foody Online Food Ordering System*

---

## 🚀 Enhanced Features (v2)

### Live Order Tracking Upgrades
- **15-second auto-poll** (down from 30s) with a live countdown progress bar at the top of the page
- **Status change toast notifications** — customer is alerted the moment their order status changes
- **Pulse animation** on the active status indicator (the orange/blue dot blinks while order is active)
- **Post-delivery rating** — 5-star rating UI slides in after delivery
- **ETA per status stage** — "25–35 min" → "10–15 min" → "Delivered!"
- **Support button** and cancel button with confirmation dialog

### Admin Orders Upgrades
- **Auto-polls every 20 seconds** — admin panel refreshes without manual click
- **New order detection** — badge appears on header + toast fires when a new order arrives
- **Filter bar** — click PENDING / OUT_FOR_DELIVERY / DELIVERED to filter table instantly
- **Order count per status** shown as chips
- **Last polled timestamp** shown in header

### Payment Success Upgrades
- **Confetti animation** on successful payment
- **Real order items** shown with individual prices
- **Payment ID** displayed for reference
- **Direct "Track My Order" CTA** button → goes straight to live tracking

### Architecture Documentation
See `REALTIME_ARCHITECTURE.md` for the WebSocket upgrade path — complete code for both frontend and Spring Boot backend.
