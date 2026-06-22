# ShopSec

A full-stack e-commerce demo with a built-in security operations admin panel. Built as a learning/portfolio project: shop as a normal user, then log in as an admin to watch login attempts, attack signatures, and account activity stream in live.

## What's inside

**Storefront (user mode)**
- Browse products by category, search, view product detail
- Register / log in (JWT auth, bcrypt-hashed passwords)
- Cart, checkout (mock payment - no real payment gateway), order history

**Admin panel (admin mode)** - `/admin`, admin role required
- Overview dashboard: user/order/revenue counts, an hourly attack-volume chart, top attacking IPs
- Live logs: every login success/failure, registration, and detected attack streams in in real time over WebSockets (Socket.io), plus a searchable/paginated history
- Users: list accounts and promote/demote admin role (passwords are never shown - they're bcrypt hashes and aren't even selected from the database for this view)
- Products: create/edit/delete catalog items
- Blocked IPs: see and lift auto-blocks

**Built-in attack detection** (educational-grade, see note below)
- Brute-force detection: 5+ failed logins for the same account from the same IP in 5 minutes -> logged as `BRUTE_FORCE` and the IP is auto-blocked
- Pattern-based SQL-injection / XSS / path-traversal detection on every request body, query, and params -> logged as `SQLI_ATTEMPT` / `XSS_ATTEMPT` / `PATH_TRAVERSAL_ATTEMPT` and the request is rejected; 3 of these from one IP in 10 minutes triggers an auto-block
- Rate limiting: 15 auth requests / 5 min per IP, 120 general API requests / min per IP
- Every event - successful or blocked - is written to the `SecurityLog` table and pushed live to any connected admin dashboard

> **Note on the detection engine:** this uses readable regex pattern-matching so the logic is easy to study and demo, not a production-grade WAF. For a real deployment you'd put this behind something like Cloudflare, ModSecurity, or a Meraki MX with IDS/IPS/AMP enabled, and treat this app-level layer as a secondary, defense-in-depth signal.

## Stack

- **Backend:** Node.js, Express, PostgreSQL via Prisma, JWT auth, bcryptjs, Socket.io, express-rate-limit, helmet
- **Frontend:** React (Vite), Tailwind CSS, React Router, Recharts, Socket.io-client

The backend serves the built frontend as static files, so the whole app deploys as **one** web service.

## Project structure

```
shopsec/
├── server/                # Express API + Socket.io
│   ├── prisma/schema.prisma
│   ├── prisma/seed.js     # creates an admin + demo user and sample products
│   └── src/
│       ├── app.js, index.js
│       ├── controllers/   # auth, product, cart, order, admin
│       ├── middleware/    # JWT auth, attack scanner, rate limiter, logger
│       ├── routes/
│       ├── sockets/       # live log broadcasting
│       └── utils/         # JWT helpers, attack pattern rules
├── client/                # React app
│   └── src/
│       ├── pages/, pages/admin/
│       ├── components/
│       ├── context/       # auth + cart state
│       └── hooks/useLiveLogs.js
└── package.json           # root build/start scripts
```

## Run it locally

You'll need Node 18+ and a PostgreSQL database (a free one from [Neon](https://neon.tech) or [Supabase](https://supabase.com) works fine, or run Postgres locally/in Docker).

```bash
git clone <this project>
cd shopsec

# Backend
cd server
cp .env.example .env        # then fill in DATABASE_URL and JWT_SECRET
npm install
npx prisma migrate dev --name init
npm run seed                # creates admin@shopsec.dev / Admin@12345
npm run dev                 # http://localhost:5000

# Frontend (separate terminal)
cd ../client
npm install
npm run dev                 # http://localhost:5173
```

The Vite dev server proxies `/api` and `/socket.io` to `localhost:5000`, so just open the frontend URL.

## Deploy to Render

This is set up for the simplest possible deploy: one web service, one managed Postgres database.

1. **Push this project to a GitHub repo.**

2. **Create a PostgreSQL database on Render:** New -> PostgreSQL. Copy the "Internal Database URL" once it's ready.

3. **Create a Web Service on Render** pointing at your repo, with:
   - **Build command:** `npm run build`
   - **Start command:** `npm start`
   - **Environment variables:**
     - `DATABASE_URL` = the Internal Database URL from step 2
     - `JWT_SECRET` = a long random string (generate with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`)
     - `NODE_ENV` = `production`
   - Leave `CLIENT_ORIGIN` unset since frontend and backend are served from the same origin.

4. **First deploy:** the build command runs `prisma migrate deploy`, which creates all the tables. After the first successful deploy, open the Render Shell for the service and run:
   ```bash
   npm run seed --prefix server
   ```
   to create the admin account and sample products.

5. Visit your `*.onrender.com` URL. Log in with the admin account, change its password (there's no self-service "change password" screen yet - it's a good first feature to add), and go to `/admin`.

Railway works the same way: same build/start commands, attach a Postgres plugin, set the same three env vars.

## Default accounts (change these after first login)

| Role  | Email                | Password      |
|-------|-----------------------|----------------|
| Admin | admin@shopsec.dev     | Admin@12345    |
| User  | demo@shopsec.dev       | Demo@12345     |

## Where to take this next

- Add a "change password" flow and email verification
- Add refresh tokens / shorter-lived JWTs with rotation
- Swap the regex attack scanner for a real WAF in front of the app, and treat this app's logs as one input into a broader SIEM
- Add a "force logout" / session revocation action in the admin panel
- Wire in a real payment provider (Stripe) for checkout
