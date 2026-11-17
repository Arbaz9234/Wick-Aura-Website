# Wick & Aura — Admin Panel

Admin dashboard for managing products and orders.

---

## Tech Stack

| Package | Purpose |
|---|---|
| React 19 | UI framework |
| Vite | Build tool & dev server |
| Tailwind CSS v4 | Utility-first styling |
| React Router | Client-side routing |
| Axios | HTTP client |
| React Toastify | Toast notifications |
| Lucide React | Icon library |

---

## Project Structure

```
admin/
├── index.html
├── vite.config.js
├── src/
│   ├── App.jsx              # Routes, auth gate, layout
│   ├── main.jsx             # Entry point
│   ├── index.css            # Tailwind + global styles
│   ├── assets/              # Static assets
│   ├── pages/
│   │   ├── AddProduct.jsx   # Create new products with image upload
│   │   ├── ListProducts.jsx # View & delete products
│   │   └── Orders.jsx       # View orders & update status
│   └── components/
│       ├── Login.jsx        # Admin login form
│       ├── Navbar.jsx       # Top navigation bar
│       ├── Sidebar.jsx      # Side navigation
│       └── ImagePreview.jsx # Image preview component
```

---

## Routes

| Path | Page | Description |
|---|---|---|
| `/add` | AddProduct | Create products with multi-image upload |
| `/list` | ListProducts | View, search & delete products |
| `/orders` | Orders | View all orders, update delivery status |

---

## Auth

Token-based admin authentication. Unauthenticated users see the login screen. Uses the `/api/user/admin` endpoint from the backend.

---

## Scripts

```bash
npm install       # Install dependencies
npm run dev       # Start dev server
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # Run ESLint
```
