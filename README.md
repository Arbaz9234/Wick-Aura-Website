# Wick & Aura - Candle E-Commerce Website

A full-stack e-commerce web application for a candle selling business. Built with a modern React frontend and a backend (coming soon).

> **Note:** This project is actively under development. Some components currently use placeholder content from an earlier reference build and will be updated to fully reflect the Wick & Aura candle brand over time.

---

## Project Structure

```
wick-and-aura-website/
├── frontend/          # React + Vite frontend application
├── backend/           # Backend API (coming soon)
└── README.md
```

---

## Frontend

### Tech Stack

- **Framework:** React 19
- **Build Tool:** Vite
- **Routing:** React Router DOM v7
- **Styling:** Tailwind CSS v4, Emotion, MUI Joy
- **Icons:** MUI Icons, Lucide React
- **Notifications:** React Toastify
- **Linting:** ESLint 9

### Pages

| Route | Page | Description |
|---|---|---|
| `/` | Home | Hero banner, latest collection, best sellers, policies, newsletter |
| `/collection` | Collection | Browse all products |
| `/product/:productId` | Product | Individual product details |
| `/cart` | Cart | Shopping cart |
| `/place-order` | Place Order | Checkout / order placement |
| `/orders` | Orders | Order history |
| `/login` | Login | User authentication |
| `/about` | About | About the brand |
| `/contact` | Contact | Contact information |
| `/insta` | Candle Shop | Candle-themed showcase page |

### Key Components

- **Navbar** & **Footer** - Site-wide layout
- **Banner** - Hero section
- **LatestCollection** & **BestSeller** - Product showcase sections
- **ProductItem** - Reusable product card
- **OurPolicy** - Store policies display
- **NewsLetter** - Email subscription block
- **Title** - Reusable section heading

### State Management

Global state is managed via React Context (`ShopContext`) providing:
- Product catalog
- Currency setting (INR)
- Delivery fee configuration

### Getting Started

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Backend

Backend implementation is planned and will be added in the `backend/` directory. Details will be updated here as development progresses.

---

## Development Roadmap

- [x] Frontend project setup (React + Vite + Tailwind)
- [x] Page routing and layout structure
- [x] Homepage with hero, collections, and newsletter
- [x] Product browsing and detail pages
- [x] Cart and checkout UI
- [x] Login page UI
- [ ] Replace all placeholder content with Wick & Aura candle branding
- [ ] Backend API development
- [ ] Database integration
- [ ] User authentication
- [ ] Payment gateway integration
- [ ] Order management system
- [ ] Admin panel

---

## License

This project is proprietary and not licensed for public use.
