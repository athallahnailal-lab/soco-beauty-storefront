# SOCO Beauty Storefront — Next.js + PWA starter

A responsive Indonesian beauty e-commerce storefront with product catalog, persistent guest cart, guest checkout, Supabase order storage, Midtrans Snap payment-session integration, and a server notification endpoint.

> This is a production-oriented starter, not a deployed store. Product content/prices/photos and shipping tariffs are illustrative. Real payments require approved Midtrans credentials and configuration. Do not launch before completing the production checklist below.

## Stack
- Next.js 14 App Router + TypeScript
- Responsive custom CSS, Lucide icons
- PWA web manifest
- Supabase Postgres schema
- Midtrans Snap transaction creation + signed notification verification

## Requirements
- Node.js 20+
- A Supabase project
- A Midtrans merchant account (start with Sandbox)
- A deployed HTTPS URL for real gateway notifications

## Local setup
1. Install Node.js 20+.
2. Extract the project and run:
   ```bash
   npm install
   cp .env.example .env.local
   npm run dev
   ```
3. Open `http://localhost:3000`.
4. Set Supabase and Midtrans values in `.env.local`. Never commit `.env.local`.

## Database
1. Open Supabase SQL Editor.
2. Run `supabase/schema.sql`.
3. Keep service-role credentials server-only. Never prefix service-role keys with `NEXT_PUBLIC_`.

### Important database hardening
The API routes use `lib/supabase/admin.ts`, a server-only service-role client, for order writes and payment notifications. The service-role key must never be exposed to browser code or committed to source control. Before production:
- Keep admin-client imports restricted to server API routes.
- Add rate limiting, bot protection, data retention, audit logs, and operational monitoring.
- Do not expose order lookup solely based on order ID + phone in a high-risk environment; add OTP or a one-time access token sent out-of-band.

## Midtrans
- Use Sandbox credentials first.
- Configure notification URL in Midtrans dashboard to:
  `https://YOUR_DOMAIN/api/payments/midtrans/notification`
- `MIDTRANS_IS_PRODUCTION=false` for sandbox; change only after merchant approval and verification.
- Test QRIS/VA payment flows, cancellation, expiry, duplicate notifications, and delayed callbacks.
- The return URL is not proof of payment. The notification endpoint verifies the signature and updates order status.
- Before go-live, verify enabled payment methods and gateway API details against current Midtrans documentation and your merchant configuration.

## PWA
The app includes a web manifest and SVG icon. Deploy over HTTPS to install it. Offline checkout is intentionally not supported; order and payment flows need a network connection.

## Routes
- `/` storefront
- `/products/[id]` product detail
- `/cart` persistent guest cart (browser local storage)
- `/checkout` two-step guest checkout
- `/orders` order lookup
- `/payment/return` payment return state
- `POST /api/checkout` validates cart server-side, stores order and creates a Midtrans Snap session
- `POST /api/payments/midtrans/notification` validates Midtrans signature and updates payment status
- `POST /api/orders/lookup` lookup example

## Current limitations / required before launch
1. **Server Supabase client:** API routes currently use the SSR session client. Replace with a server-only service-role client as described above and ensure the service key is never sent to the browser.
2. **Catalog source of truth:** product prices are currently held in `lib/products.ts`. Replace with database-backed catalog and inventory. Recalculate price and stock in a transaction at checkout.
3. **Shipping:** displayed shipping rates are illustrative. Integrate a carrier/aggregator and validate serviceability and rates server-side.
4. **Promotions/tax:** implement server-side promo rules, expiry, eligibility, and reconciliation.
5. **Payment mapping:** confirm Midtrans payment types for your merchant account. QRIS and bank transfer methods may need method-specific configuration.
6. **COD:** deliberately disabled until carrier/COD handling exists.
7. **Customer accounts:** this starter does not create customer accounts or implement one-tap registration. Add Supabase Auth (OTP/email) and explicit consent before linking a guest order to an account.
8. **Order lookup:** add OTP or signed, expiring order-access tokens, rate limiting, and anti-enumeration protections.
9. **Privacy/legal:** publish privacy notice, terms, refund/cancellation policy, and data retention procedures. Follow applicable Indonesian data protection and consumer rules.
10. **Operations:** configure logs/alerts, backups, incident response, security review, accessibility QA, analytics consent, and load testing.
11. **Assets/branding:** use assets you own or are licensed to use. This starter is not affiliated with or endorsed by Sociolla.
12. **Tests:** add unit/integration/e2e tests and CI. Validate webhook idempotency and concurrency before production.

## Deploy
Deploy to a Node-compatible platform (for example Vercel) with the environment variables configured in the platform dashboard. Configure the public site URL and Midtrans notification URL to the deployed HTTPS domain. A successful build/deployment does not itself activate payments until valid merchant credentials and dashboard configuration are provided.
