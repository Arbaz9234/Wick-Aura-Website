# Wick & Aura — Customer Storefront

React SPA for browsing products, managing cart/wishlist, checkout, and user account.

---

## Tech Stack

| Package         | Purpose                       |
| --------------- | ----------------------------- |
| React 19        | UI framework                  |
| Vite            | Build tool & dev server       |
| Tailwind CSS v4 | Utility-first styling         |
| React Router    | Client-side routing           |
| Framer Motion   | Animations & page transitions |
| Axios           | HTTP client                   |
| React Toastify  | Toast notifications           |
| Lucide React    | Icon library                  |
| Swiper          | Image carousels               |

---

## Routes

| Path                  | Page       | Description                            |
| --------------------- | ---------- | -------------------------------------- |
| `/`                   | Home       | Landing page                           |
| `/home`               | Shop       | Product storefront                     |
| `/collection`         | Collection | Browse, filter & sort products         |
| `/product/:productId` | Product    | Product details & color selection      |
| `/cart`               | Cart       | Shopping cart                          |
| `/place-order`        | PlaceOrder | Checkout with address picker & payment |
| `/orders`             | Orders     | Order history                          |
| `/login`              | Login      | Auth with OTP & forgot password flows  |
| `/account`            | Account    | Profile, addresses, 2FA toggle         |
| `/wishlist`           | Wishlist   | Saved products                         |
| `/about`              | About      | About the brand                        |
| `/contact`            | Contact    | Contact information                    |

---

## Key Features

- **OTP Authentication** — email verification on signup, optional 2FA on login
- **Forgot Password** — OTP-based password reset with animated stepper
- **Guest Cart** — works without login, merges on authentication
- **Mobile-first** — responsive layouts with dedicated mobile components
- **Page Transitions** — Framer Motion animated route transitions
- **Optimistic Updates** — wishlist toggles update instantly
- **Loading & Error States** — skeleton/retry UI on data-driven sections

---
