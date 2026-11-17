# Wick & Aura — Backend API

REST API server for the Wick & Aura candle e-commerce platform.

---

## Tech Stack

| Package      | Purpose                  |
| ------------ | ------------------------ |
| Express 5    | Web framework            |
| Mongoose     | MongoDB ODM              |
| bcrypt       | Password & OTP hashing   |
| jsonwebtoken | JWT authentication       |
| Nodemailer   | Email (OTP verification) |
| Cloudinary   | Image hosting & CDN      |
| Multer       | File upload handling     |
| Razorpay     | Payment gateway          |
| validator    | Input validation         |

---

## API Routes

### Users — `/api/user`

| Endpoint                     | Auth | Description                      |
| ---------------------------- | ---- | -------------------------------- |
| `register`                   | —    | Register (sends OTP email)       |
| `login`                      | —    | Login (supports 2FA)             |
| `verify-signup-otp`          | —    | Verify email OTP on signup       |
| `verify-login-otp`           | —    | Verify 2FA login OTP             |
| `forgot-password`            | —    | Request password reset OTP       |
| `verify-forgot-password-otp` | —    | Verify forgot password OTP       |
| `reset-password`             | —    | Reset password with verified OTP |
| `resend-otp`                 | —    | Resend OTP (rate limited)        |
| `toggle-2fa`                 | User | Toggle two-factor auth           |

### Products — `/api/product`

| Endpoint | Auth  | Description               |
| -------- | ----- | ------------------------- |
| `list`   | —     | List all products         |
| `single` | —     | Get single product        |
| `add`    | Admin | Add product (with images) |
| `remove` | Admin | Remove product            |

### Cart — `/api/cart`

| Endpoint | Auth | Description               |
| -------- | ---- | ------------------------- |
| `add`    | User | Add item to cart          |
| `update` | User | Update item quantity      |
| `get`    | User | Get cart contents         |
| `merge`  | User | Merge guest cart on login |

### Orders — `/api/order`

| Endpoint     | Auth  | Description         |
| ------------ | ----- | ------------------- |
| `place`      | User  | Place COD order     |
| `userorders` | User  | Get user's orders   |
| `list`       | Admin | List all orders     |
| `status`     | Admin | Update order status |

### Subscriptions — `/api/subscription`

| Endpoint    | Auth | Description               |
| ----------- | ---- | ------------------------- |
| `subscribe` | —    | Subscribe to newsletter   |
| `status`    | —    | Check subscription status |
