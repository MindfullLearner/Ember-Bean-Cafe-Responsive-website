# ☕ Ember & Bean Cafe — Full Stack Web Application

![Project Status](https://img.shields.io/badge/status-completed-brightgreen)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)
![REST API](https://img.shields.io/badge/REST-API-blue)
![Responsive](https://img.shields.io/badge/Responsive-Yes-blue)

> A warm, aesthetic, and fully responsive **Full Stack Web Application** for a modern coffee shop — **"Ember & Bean"**. Built as part of **Full Stack Development Internship Projects 1 & 2** at DecodeLabs.
>
> Project 1 focused on the responsive frontend. Project 2 extended it with a complete RESTful backend API and a dark-themed API Tester UI.

---

## 📌 Live Demo

🔗 **[View Live Website](https://ember-bean-cafe-responsive-website.onrender.com)** 

> To run the full stack version with the API, follow the local setup instructions below.

---

## 🎯 Project Overview

This project is split into two phases:

| Phase | Focus | Tech |
|-------|-------|------|
| **Project 1 — Frontend** | Responsive cafe website with mobile-first design | HTML5, CSS3, JavaScript |
| **Project 2 — Backend** | RESTful API with validation, routes, controllers, middleware | Node.js, Express.js |

---

## 📁 Project Structure

```
Ember-Bean-Cafe-Responsive-website/
│
├── 📂 frontend/                        ← Project 1: Cafe Website (Customer-facing)
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
│
├── 📂 backend/                         ← Project 2: REST API Server
│   ├── server.js                       ← Entry point
│   ├── package.json
│   ├── package-lock.json
│   ├── routes/
│   │   └── api.js                      ← All route definitions
│   ├── controllers/
│   │   └── handlers.js                 ← Business logic
│   ├── middleware/
│   │   └── validation.js               ← Input validation (The Gatekeeper)
│   └── data/
│       └── menu.json                   ← Menu data store
│
├── 📂 api-tester/                      ← Project 2: Dark-themed API Tester UI
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
│
└── README.md
```

---

## 🚀 Getting Started

### Run the Frontend Only (Project 1)

No setup needed. Just open the file directly:

```
frontend/index.html  →  double-click to open in browser
```

---

### Run the Full Stack App (Project 2)

**Step 1 — Install dependencies**
```bash
cd backend
npm install
```

**Step 2 — Start the server**
```bash
# Production mode
npm start

# Development mode (auto-restart on file save)
npm run dev
```

**Step 3 — Open in browser**

| URL | What it opens |
|-----|--------------|
| `http://localhost:3000` | API Tester UI |
| `http://localhost:3000/api/health` | Server health check |
| `http://localhost:3000/api/menu` | All menu items (JSON) |

---

## 📋 API Endpoints

### Base URL: `http://localhost:3000/api`

#### 🗂 Menu

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/menu` | Fetch all menu items |
| GET | `/menu/:id` | Fetch single item by ID (e.g. `EB001`) |

**Query Parameters for `/menu`:**
- `?category=latte` — filter by category
- `?available=true` — filter by availability

---

#### 🛒 Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/orders` | Place a new order |
| GET | `/orders` | Fetch all orders |

**Query Parameters for GET `/orders`:**
- `?status=received` — filter by status
- `?email=x@y.com` — filter by customer email

---

#### 📩 Contact

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/contact` | Submit contact form |
| GET | `/contact/submissions` | Fetch all submissions |

---

#### 📬 Newsletter

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/subscribe` | Subscribe to newsletter |

---

#### 🩺 Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Check if server is running |

---

## 📦 Response Format

Every API response follows this consistent JSON structure:

### ✅ Success
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### ❌ Error
```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": {
    "email": ["Email is required.", "Please provide a valid email."]
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## 🔢 HTTP Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET |
| 201 | Created | Successful POST (new resource created) |
| 400 | Bad Request | Validation failed / missing fields |
| 404 | Not Found | Resource does not exist |
| 409 | Conflict | Email already subscribed |
| 500 | Internal Server Error | Unhandled server-side error |

---

## ✅ Validation Rules (The Gatekeeper)

### Contact Form
| Field | Rules |
|-------|-------|
| `name` | Required, min 2 chars, max 50 chars |
| `email` | Required, valid email format |
| `message` | Required, min 10 chars, max 500 chars |
| `phone` | Optional, 7–15 digits if provided |
| `subject` | Optional, must be a valid enum value |

### Order
| Field | Rules |
|-------|-------|
| `itemId` | Required, must exist in menu |
| `quantity` | Required, number, min 1, max 20 |
| `customerName` | Required, min 2 chars |
| `customerEmail` | Required, valid email format |
| `specialInstructions` | Optional, max 200 chars |

### Newsletter
| Field | Rules |
|-------|-------|
| `email` | Required, valid email format, not already subscribed |

---

## 🧱 Menu Item IDs

| ID | Name | Category | Price |
|----|------|----------|-------|
| EB001 | Ember Espresso | espresso | $3.50 |
| EB002 | Mocha Mousse Latte | latte | $5.25 |
| EB003 | Velvet Vanilla Brew | cold-brew | $4.75 |
| EB004 | Caramel Cloud Cappuccino | cappuccino | $4.50 |
| EB005 | Terracotta Chai | chai | $4.00 |
| EB006 | Midnight Cold Brew | cold-brew | $4.25 |
| EB007 | Butter Croissant | pastry | $3.00 |
| EB008 | Hazelnut Flat White | flat-white | $4.75 |

---

## 🎨 Design System

### Color Palette

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Mocha Mousse** | `#A67B5B` | Primary accent (buttons, highlights) |
| **Ethereal Blue** | `#7B9EB3` | Secondary accents |
| **Warm Off-White** | `#FEF8F0` | Page background |
| **Terracotta** | `#C46D5E` | Tertiary accent |
| **Dark Text** | `#2C2C2C` | Body text |

### Typography

| Element | Font |
|---------|------|
| Headings | Playfair Display |
| Body Text | Poppins |
| API Tester Code | JetBrains Mono |

---

## 📱 Responsive Breakpoints (Frontend)

| Device | Breakpoint | Layout |
|--------|------------|--------|
| Mobile | < 768px | Single column, hamburger menu |
| Tablet | 768px – 1024px | 2-column cards |
| Desktop | > 1024px | 3-column cards, max-width 1200px |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Backend** | Node.js, Express.js v5 |
| **Validation** | Custom middleware (no external library) |
| **Data Store** | In-memory + JSON file (menu) |
| **Dev Tools** | nodemon, npm |
| **Hosting** | GitHub Pages (frontend) |
| **Version Control** | Git & GitHub |

---

## 🔑 Key Concepts Demonstrated

### Frontend (Project 1)
- Mobile-first responsive design with CSS Grid and Flexbox
- Fluid typography using `clamp()`
- CSS custom properties for consistent theming
- Semantic HTML5 landmarks for accessibility (WCAG)
- JavaScript DOM manipulation — hamburger menu, form validation, CTA alerts
- Smooth scroll and active navigation highlighting

### Backend (Project 2)
- RESTful API design with proper HTTP methods and status codes
- MVC-inspired architecture — routes → controllers → middleware
- Input validation with field-level error messages ("Never Trust the Client")
- Consistent JSON response envelope for all endpoints
- In-memory data stores with runtime state management
- Global error handler for malformed JSON and server crashes
- CORS configured for cross-origin frontend access
- Static file serving — backend serves the API Tester UI

---

## 🌱 Future Improvements

- [ ] Connect to a real database (MongoDB or PostgreSQL)
- [ ] Add JWT authentication for admin routes
- [ ] Deploy backend to Railway or Render
- [ ] Connect Project 1 frontend contact form to the live API
- [ ] Add order status tracking with WebSockets

---

## 👨‍💻 Author

Built with ☕ as part of the **DecodeLabs Full Stack Development Internship**

---

*Ember & Bean — Slow brews, warm moments.*
