
# MyStore Pro — Full‑Stack E‑commerce (React + Spring Boot + MySQL)

A production‑ready e‑commerce web app with **React (JavaScript)** on the frontend and **Spring Boot** on the backend, secured with **JWT** and persisted in **MySQL**. Users can browse products, add to cart, checkout; admins can manage products. The project follows a practical **XYZ method** for authentication flows: **eXtract → Validate → eXecute**.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Local Setup](#local-setup)
  - [Backend (Spring Boot)](#backend-spring-boot)
  - [Frontend (React)](#frontend-react)
- [Configuration](#configuration)
  - [Backend `application.properties`](#backend-applicationproperties)
  - [Frontend `.env`](#frontend-env)
- [Database Schema & Roles](#database-schema--roles)
  - [Create Roles and Admin](#create-roles-and-admin)
  - [Fix Duplicate Roles](#fix-duplicate-roles)
- [Security & Auth (XYZ Method)](#security--auth-xyz-method)
- [Backend API Reference](#backend-api-reference)
  - [Auth](#auth)
  - [Products](#products)
  - [Cart](#cart)
  - [Orders & Payment](#orders--payment)
  - [Reviews](#reviews)
- [Frontend Reference](#frontend-reference)
  - [Routes](#routes)
  - [State & API Modules](#state--api-modules)
  - [UI/UX Notes](#uiux-notes)
- [Admin Guide](#admin-guide)
- [Troubleshooting](#troubleshooting)
- [Production Build & Deployment](#production-build--deployment)
- [Future Improvements](#future-improvements)
- [License](#license)

---

## Architecture Overview

```text
Browser (React, JavaScript)
  │
  ├── Axios (with Bearer JWT)
  │
  ▼
Spring Boot (REST API, Spring Security + JWT)
  │
  ├── Services
  ├── JPA/Hibernate
  ▼
MySQL (users, roles, products, cart, orders, reviews)
```

- **Frontend**: React (JavaScript), Vite, React Router, Zustand, React Query, Axios
- **Backend**: Spring Boot 3, Spring Security, JWT, Hibernate (JPA)
- **Database**: MySQL 8+

---

## Tech Stack

**Frontend**  
- React (JavaScript)  
- Vite (dev/build)  
- React Router (routing)  
- @tanstack/react-query (server caching)  
- Zustand (auth/session store)  
- Axios (HTTP client)

**Backend**  
- Spring Boot 3.x  
- Spring Security 6.x + JWT  
- Hibernate (JPA)  
- HikariCP (connection pool)  
- Lombok (optional)  

**Database**  
- MySQL 8.x

---

## Local Setup

### Backend (Spring Boot)

**Prerequisites**
- Java 17+ (Java 21 recommended)
- Maven 3.9+
- MySQL running locally

**Steps**
```bash
# create database (adjust name to match application.properties)
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS ecommerce;"
# run app
mvn spring-boot:run
# backend runs at http://localhost:8081
```

### Frontend (React)

**Prerequisites**
- Node.js 18+ (20 LTS recommended)
- npm 9+

**Steps**
```bash
npm install
npm run dev
# Frontend at http://localhost:5173
```

> For a production build:
```bash
npm run build
npm run preview  # http://localhost:4173
```

---

## Configuration

### Backend `application.properties`

```properties
# server
server.port=8081

# datasource
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD

# jpa
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# jwt
app.jwt.secret=CHANGE_ME_TO_A_LONG_RANDOM_SECRET
app.jwt.expiration=86400000

# optional: seed admin on startup (if you add BootstrapAdmin)
app.seed.admin.email=admin@example.com
app.seed.admin.password=Admin@123
```

> CORS should allow the front-end origin (e.g., `http://localhost:5173`). Example Java config:

```java
@Configuration
public class CorsConfig {
  @Bean
  public WebMvcConfigurer corsConfigurer() {
    return new WebMvcConfigurer() {
      @Override
      public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET","POST","PUT","DELETE","PATCH","OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
      }
    };
  }
}
```

### Frontend `.env`

```bash
VITE_API_URL=http://localhost:8081
```

After editing `.env`, **restart** the dev server.

---

## Database Schema & Roles

**Core tables**
- `users (id, email, password)`
- `roles (id, name)` → values like `ROLE_USER`, `ROLE_ADMIN`
- `user_roles (user_id, role_id)` (many‑to‑many)
- `product (id, name, price, description, imageUrl, ...)`
- `cart_item (...)` (implementation may vary)
- `orders (...)`
- `reviews (id, product_id, rating, comment, author_email, created_at, ...)`

### Create Roles and Admin

```sql
-- roles
INSERT IGNORE INTO roles(name) VALUES ('ROLE_USER'), ('ROLE_ADMIN');

-- create admin user (if not existing)
INSERT INTO users(email, password)
SELECT 'admin@example.com', '$2a$10$8bq7...ENCRYPTED_BCRYPT...'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email='admin@example.com');
-- Tip: generate a bcrypt hash or create via application code with BCryptPasswordEncoder

-- link admin role (find ids first)
SELECT id FROM users WHERE email='admin@example.com';   -- suppose 5
SELECT id FROM roles WHERE name='ROLE_ADMIN';           -- suppose 2
INSERT INTO user_roles(user_id, role_id)
SELECT 5, 2
WHERE NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id=5 AND role_id=2);
```

### Fix Duplicate Roles

If you ever see `NonUniqueResultException` for `findByName`, you have duplicate rows in `roles`.

```sql
-- Inspect duplicates
SELECT name, COUNT(*) cnt FROM roles GROUP BY name HAVING cnt > 1;
SELECT id, name FROM roles ORDER BY name, id;

-- Example: keep smallest id for each name and repoint user_roles
UPDATE user_roles SET role_id = 2 WHERE role_id = 3; -- ADMIN: 3 -> 2
UPDATE user_roles SET role_id = 1 WHERE role_id = 4; -- USER : 4 -> 1
DELETE FROM roles WHERE id IN (3,4);

-- Add a unique constraint to prevent future duplicates
ALTER TABLE roles ADD CONSTRAINT uq_roles_name UNIQUE (name);
```

---

## Security & Auth (XYZ Method)

**JWT flow (“XYZ”):**
1. **eXtract** → Frontend pulls token from local storage/Zustand and attaches `Authorization: Bearer <token>`.
2. **Validate** → Backend validates JWT (signature, expiry) using `JwtService` & Spring Security filter.
3. **eXecute** → If valid, controller executes the business logic; otherwise returns 401/403.

**Security config essentials:**
```java
http
  .csrf(csrf -> csrf.disable())
  .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
  .authorizeHttpRequests(auth -> auth
    .requestMatchers("/api/auth/register", "/api/auth/login").permitAll()
    .requestMatchers(HttpMethod.GET, "/api/products", "/api/product/**").permitAll()
    .requestMatchers("/cart/**", "/api/orders/**", "/payment/**", "/reviews/**").authenticated()
    .requestMatchers(HttpMethod.POST, "/api/product").hasRole("ADMIN")
    .requestMatchers(HttpMethod.PUT, "/api/product/**").hasRole("ADMIN")
    .requestMatchers(HttpMethod.DELETE, "/api/product/**").hasRole("ADMIN")
    .anyRequest().authenticated()
  )
  .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
```

**Auth responses** should include at least `{ token, user: { id, email, role } }` so the frontend can derive `userId` for cart/orders.

---

## Backend API Reference

> Base URL: `http://localhost:8081`

### Auth

| Method | Path                       | Auth | Body (JSON)                                 | Response (200)                                       |
|-------:|----------------------------|:-----|---------------------------------------------|------------------------------------------------------|
| POST   | `/api/auth/register`       | ❌    | `{ "email": "a@b.com", "password":"..." }`  | `{ "token":"...", "user": { "id":1,"email":"...","role":"ROLE_USER" } }` or simple success |
| POST   | `/api/auth/login`          | ❌    | `{ "email": "a@b.com", "password":"..." }`  | `{ "token":"...", "user": { "id":1,"email":"...","role":"ROLE_..." } }`                    |

### Products

| Method | Path                     | Auth    | Body (JSON)                                  | Notes                     |
|-------:|--------------------------|:--------|----------------------------------------------|---------------------------|
| GET    | `/api/products`          | ❌       | —                                            | List all products         |
| GET    | `/api/product/{id}`      | ❌       | —                                            | Get product by id         |
| POST   | `/api/product`           | `ADMIN` | `{ "name":"X","price":99,"description":"" }` | Create product            |
| PUT    | `/api/product/{id}`      | `ADMIN` | Partial fields                               | Update product            |
| DELETE | `/api/product/{id}`      | `ADMIN` | —                                            | Delete product            |

### Cart

| Method | Path                                   | Auth | Body | Notes                                      |
|-------:|----------------------------------------|:-----|------|--------------------------------------------|
| GET    | `/cart/{userId}`                       | ✅    | —    | Get user cart                              |
| POST   | `/cart/add/{userId}/{productId}`       | ✅    | —    | Add product to cart                        |
| DELETE | `/cart/remove/{userId}/{productId}`    | ✅    | —    | Remove one product line from cart          |
| DELETE | `/cart/clear/{userId}`                 | ✅    | —    | Clear entire cart                          |

### Orders & Payment

| Method | Path                               | Auth | Body | Notes                                          |
|-------:|------------------------------------|:-----|------|------------------------------------------------|
| POST   | `/api/orders/checkout/{userId}`    | ✅    | —    | Create order from cart                         |
| GET    | `/api/orders/{id}`                 | ✅    | —    | Get order details                              |
| POST   | `/payment/{orderId}`               | ✅    | —    | Simulated payment/confirmation                 |

### Reviews

| Method | Path                              | Auth | Body (JSON)                                  | Notes                |
|-------:|-----------------------------------|:-----|----------------------------------------------|----------------------|
| GET    | `/reviews/product/{productId}`    | ❌/✅ | —                                            | List reviews by prod |
| POST   | `/reviews`                        | ✅    | `{ "productId":1, "rating":5, "comment":"…" }` | Add a review         |

> Exact payloads may vary slightly with your model; adjust as needed.

---

## Frontend Reference

### Routes

| Path                  | Access     | Purpose                                   |
|-----------------------|------------|-------------------------------------------|
| `/`                   | Public     | Home/Hero                                 |
| `/products`           | Public     | Browse products                           |
| `/product/:id`        | Public     | Product detail + Add to Cart + Reviews    |
| `/cart`               | Auth       | View/Manage cart                          |
| `/checkout`           | Auth       | Checkout → Payment                        |
| `/orders/:id`         | Auth       | Order confirmation                        |
| `/login`              | Public     | Login                                     |
| `/register`           | Public     | Register                                  |
| `/admin/products`     | Admin only | Create/Update/Delete products             |

### State & API Modules

- **Auth store (`store/auth`)**: keeps `{ token, user: { id, email, role } }` in Zustand (persisted).  
- **Axios client (`api/client`)**: attaches `Authorization: Bearer <token>` and logs out on 401.  
- **API modules**:
  - `api/auth` → `login`, `register`
  - `api/products` → `listProducts`, `getProduct`, `createProduct`, `updateProduct`, `deleteProduct`
  - `api/cart` → `getCart`, `addToCart`, `removeFromCart`, `clearCart`
  - `api/orders` → `checkout`, `pay`, `getOrder`
  - `api/reviews` → `listReviews`, `addReview`

### UI/UX Notes

- Responsive grid/cards with clean dark theme.  
- React Query handles loading/error states and cache invalidation.  
- Notifications (toasts) for add‑to‑cart, reviews, and failures.  

---

## Admin Guide

**Sign in at** `http://localhost:5173/login` with an admin account (has `ROLE_ADMIN`).  
You’ll see an **Admin** link in the navbar leading to **/admin/products** to create/update/delete products.

**Grant admin role (SQL):**
```sql
INSERT IGNORE INTO roles(name) VALUES ('ROLE_ADMIN');
SELECT id FROM users WHERE email='user@site.com';     -- user_id
SELECT id FROM roles WHERE name='ROLE_ADMIN';         -- role_id
INSERT INTO user_roles(user_id, role_id)
SELECT <user_id>, <role_id>
WHERE NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id=<user_id> AND role_id=<role_id>);
```

---

## Troubleshooting

- **403 on /api/auth/register**  
  Remove `Authorization: Basic …` header in Postman; `register/login` must be public. Ensure SecurityConfig `.permitAll()` on `/api/auth/**` and `csrf().disable()`.

- **NonUniqueResultException for roles**  
  You have duplicate rows in `roles`. See [Fix Duplicate Roles](#fix-duplicate-roles). Add unique constraint on `roles.name`.

- **CORS error in browser**  
  Allow origin `http://localhost:5173` and `Authorization` header in CORS config.

- **Cart add fails (401 or 404)**  
  Ensure JWT is present; endpoint should be `/cart/add/{userId}/{productId}`; userId & productId must be numbers. Check your `CartController` mapping.

- **Admin link not visible**  
  Ensure login response includes `user.role` containing `"ADMIN"`. Re‑login after promoting the user. Frontend guard can check `.includes("ADMIN")` for robustness.

- **Vite error “Cannot find @vitejs/plugin-react”**  
  `npm i -D @vitejs/plugin-react`

---

## Production Build & Deployment

- **Frontend**: `npm run build` → deploy `dist/` to static host (Nginx/Vercel/Netlify).  
  Set environment variable `VITE_API_URL` to your backend URL.
- **Backend**: Deploy Spring Boot JAR to server (or Docker).  
  Configure `application.properties` with production DB and **strong JWT secret**.  
  Ensure CORS allows your production frontend domain.  
- **Database**: Create the schema. Consider Flyway/Liquibase for migrations.

---

## Future Improvements

- Payment gateway integration (Stripe/Razorpay).  
- Order history & tracking for users.  
- Inventory management & stock levels.  
- Image upload for products (S3/local).  
- Email notifications (order confirmations, password reset).  
- Switch to TypeScript when the model stabilizes.

---

