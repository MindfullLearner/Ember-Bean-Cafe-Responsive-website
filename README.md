# ☕ Ember & Bean Cafe - Responsive Website

![Project Status](https://img.shields.io/badge/status-completed-brightgreen)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Responsive](https://img.shields.io/badge/Responsive-Yes-blue)

> A warm, aesthetic, and fully responsive frontend website for a modern coffee shop - **"Ember & Bean"**. Built as part of **Full Stack Development Internship Project 1** at DecodeLabs.

---

## 📌 Live Demo

🔗 **[View Live Website](https://mindfulllearner.github.io/Ember-Bean-Cafe-Responsive-website/)** 

---

## 🎯 Project Overview

This project demonstrates a **mobile-first responsive frontend interface** with modern 2025 UI/UX design principles. It showcases the ability to build flexible, accessible, and aesthetically pleasing web layouts using pure HTML, CSS, and JavaScript - no frameworks, no backend.

### Key Features

| Feature | Description |
|---------|-------------|
| 📱 **Mobile-First Design** | Optimized for all screen sizes starting from 375px to 1440px+ |
| 🍔 **Responsive Navigation** | Hamburger menu on mobile, horizontal nav on tablet/desktop |
| 🎨 **2025 UI/UX Trends** | Warm, grounded aesthetics with Mocha Mousse & Ethereal Blue |
| ♿ **WCAG Accessible** | Semantic HTML, proper color contrast, and focus states |
| ⚡ **Interactive Elements** | Contact form alert, button hover effects |
| ☕ **Product Showcase** | 3 signature coffee cards with call-to-action buttons |
| 📧 **Contact Section** | Working contact form with JavaScript alert |
| 📍 **Location & Hours** | Store information and opening hours |

---

## 🛠️ Technologies Used

| Technology | Purpose |
|------------|---------|
| **HTML5** | Semantic structure (header, nav, main, section, article, footer) |
| **CSS3** | Responsive styling (Grid, Flexbox, Media Queries, clamp()) |
| **JavaScript** | Interactivity (hamburger menu toggle, form alerts) |
| **Git & GitHub** | Version control and deployment |
| **GitHub Pages** | Free live hosting |

---

## 📁 Project Structure
Ember-Bean-Cafe-Responsive-website/
├── index.html
├── css/
│    └── style.css      ← href="css/style.css"
└── js/
     └── script.js      ← src="js/script.js"

---

## 🎨 Design System (2025 UI/UX Trend)

### Color Palette

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Mocha Mousse** | `#A67B5B` | Primary accent (buttons, highlights) |
| **Ethereal Blue** | `#7B9EB3` | Secondary accents |
| **Warm Off-White** | `#FEF8F0` | Page background |
| **Terracotta** | `#C46D5E` | Tertiary accent |
| **Dark Text** | `#2C2C2C` | Body text for readability |

### Typography

| Element | Font Family |
|---------|-------------|
| **Headings** | 'Playfair Display', 'Montserrat' |
| **Body Text** | 'Poppins', 'Roboto' |

---

## 📱 Responsive Breakpoints

| Device | Breakpoint | Layout Behavior |
|--------|------------|-----------------|
| **Mobile** | < 768px | Single column, hamburger menu |
| **Tablet** | 768px - 1024px | 2 columns for cards |
| **Desktop** | > 1024px | 3 columns, max-width 1200px centered |

---

## 🚀 Features Demonstrated

### 1. Responsive Navigation
- **Mobile (<768px)**: Hidden behind ☰ hamburger menu with JavaScript toggle
- **Tablet/Desktop (≥768px)**: Horizontal navigation bar visible
- Smooth CSS transitions for menu open/close

### 2. Interactive Elements
- **Contact Form**: "Send Message" button shows confirmation alert
- **Order Now Buttons**: Each coffee card has interactive button
- **Hover Effects**: Cards lift slightly, buttons change color

### 3. Semantic HTML5 Structure
<header> → <nav> → Logo + Navigation <main> → Hero Section → Signature Brews Section (3 <article> cards) → Why Choose Us Section → Contact Section <footer> → Contact info + Copyright ```

### 4. Modern CSS Techniques
CSS Grid: Card layouts (1→2→3 columns responsive)
Flexbox: Navigation, hero section, form layout
clamp(): Fluid typography clamp(1rem, 2.5vw, 1.5rem)
CSS Variables: For consistent theming
Transitions: Smooth hover effects on cards and buttons

