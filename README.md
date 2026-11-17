    # Wick & Aura — Candle E-Commerce Platform

    Full-stack MERN e-commerce app for a candle business: a customer storefront, a REST API, and a separate admin panel. Includes OTP-based auth with optional 2FA, Razorpay payments, and server-synced cart/wishlist.

    <!-- **Live demo:** `<add link>` · **Admin demo:** `<add link>` · **Demo credentials:** `<add if public>` -->

    ![Storefront](./frontend/src/assets/docs/Home.png)
    ![Product](./frontend/src/assets/docs/Product.png)
    ![Cart](./frontend/src/assets/docs/Cart.png)

    ---

    ## Architecture

    ```
    wick-and-aura-website/
    ├── frontend/   # Customer storefront  (React + Vite)
    ├── admin/      # Admin panel          (React + Vite)
    └── backend/    # REST API             (Express + MongoDB)
    ```

    Both React apps talk to the same Express API. Admin routes are protected with a separate token-based admin login.

    ## Tech Stack

    | Layer            | Stack                                                                            |
    | ---------------- | -------------------------------------------------------------------------------- |
    | Frontend / Admin | React 19, Vite, Tailwind CSS v4, React Router, Context API, Axios, Framer Motion |
    | Backend          | Node.js, Express 5, MongoDB + Mongoose, JWT, bcrypt, Multer                      |
    | Integrations     | Razorpay (payments), Nodemailer (OTP emails), Cloudinary (image hosting)         |

    ---

    ## Key Features & Engineering Highlights

    **Authentication & security**

    - Email/password signup with OTP email verification
    - Optional per-user 2FA: login requires an OTP when enabled
    - OTP-based forgot-password flow
    - OTPs are hashed with bcrypt; resend is rate-limited (60s)
    - JWT-protected routes; separate admin authentication

    **Cart & checkout**

    - Guest cart that merges into the user's server-side cart on login
    - Color variants and quantity management
    - Saved addresses with an address picker at checkout
    - Cash on Delivery and Razorpay, with server-side payment verification

    **Catalog & user account**

    - Search, filter and sort by category, type and price
    - Wishlist synced to the user's account
    - Order history and status tracking
    - Profile, address and security (2FA) management

    **Admin panel**

    - Add/delete products with image upload (Cloudinary)
    - View all orders and update order status

    **Frontend**

    - Mobile-first responsive layouts
    - Global state with React Context (products, cart, orders, wishlist, user)
    - Loading and error states on data-driven sections
    - Page transitions with Framer Motion

    ---

    ## API Overview

    | Resource | Base path      | Notable endpoints                                                                                                                                                          |
    | -------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | Products | `/api/product` | `list`, `single`, `add` (admin), `remove` (admin)                                                                                                                          |
    | Users    | `/api/user`    | `register`, `login`, `verify-signup-otp`, `verify-login-otp`, `forgot-password`, `reset-password`, `resend-otp`, `toggle-2fa`, `profile`, `addresses`, `wishlist`, `admin` |
    | Cart     | `/api/cart`    | `add`, `update`, `get`, `merge`                                                                                                                                            |
    | Orders   | `/api/order`   | `place` (COD), `razorpay`, `verifyRazorpay`, `userorders`, `list` (admin), `status` (admin)                                                                                |

    **Data models:** `User` (profile, cart, addresses, wishlist, OTP fields, 2FA flag), `Product`, `Order`.

    ---

    ## Author

    **Arbaz Tahir** — Frontend Developer · [GitHub](https://github.com/Arbaz9234) · [LinkedIn](https://www.linkedin.com/in/md-arbaz-tahir/) ·
    <a href="#" onclick="navigator.clipboard.writeText('arbaz9234@gmail.com'); return false;">
    Email
    </a>

    _Proprietary project, not licensed for public use._
