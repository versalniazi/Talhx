# TALHX — Website

Production website for **TALHX LIMITED** (Company No. 17475450), built with Next.js (App Router), TypeScript and Tailwind CSS.

## Getting started

```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_SITE_URL to the live domain
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
npm run typecheck
```

## Structure

```
src/
  app/                 Routes (pages, API routes, sitemap, robots, OG image)
    api/orders         POST create order (price is always taken from the server catalogue)
    api/orders/lookup  GET order by ID + payment reference (both required)
    api/payment-confirmation  POST customer payment confirmation (multipart, optional screenshot)
    api/contact        POST enquiry
    api/newsletter     POST newsletter signup (explicit consent)
  components/          Reusable UI, layout, home, pricing, checkout, payment, forms, blog
  data/                Company info, 30 packages, 6 services, FAQs, blog posts — edit content here
  lib/                 Validation, sanitisation, security (rate limit, origin check, anti-spam),
                       SEO helpers, order model + data store
```

## Content

- **Company details:** `src/data/site.ts`. `COMPANY.email` and `COMPANY.phone` are deliberately empty. Add real values to display them across the site.
- **Packages & prices:** `src/data/packages.ts`
- **Services:** `src/data/services.ts`
- **Bank details:** `src/lib/payment-details.ts`. These are shown only on the payment step.

## Orders & payments

1. A customer chooses a package and reaches `/checkout?package=<slug>`. They confirm the package, enter their details, review the order and click **Continue to Payment**.
2. `POST /api/orders` creates an order with a unique order ID (`ORD-YYMMDD-XXXX`) and payment reference (`TALHX-######`). The order starts as `paymentStatus: pending` and `orderStatus: awaiting_payment`.
3. `/payment-success` shows the bank transfer details, with copy buttons, and the exact amount to pay.
4. `/payment-pending` takes the customer's payment confirmation. The order moves to `confirmation_submitted` / `payment_review`, which is shown to the customer as **"Awaiting Payment Verification"**. Payment is **never** marked as received automatically.

The order model (statuses: Pending, Confirmation Submitted, Verified, Rejected, Refunded; New, Awaiting Payment, Payment Review, In Progress, Completed, Cancelled) is in `src/lib/orders/types.ts`.

### Data store

`src/lib/orders/repository.ts` ships a JSON-file store in `DATA_DIR` (default `.data/`, git-ignored). It falls back to in-memory storage on read-only hosts. This is fine for development and a single small server. **For production, implement the `DataStore` interface with a real database** and return it from `getStore()`. Uploaded payment screenshots are written to `DATA_DIR/uploads` (never web-accessible). Use object storage in production.

Set `NOTIFICATION_WEBHOOK_URL` (server-only) to receive a POST for each new order, payment confirmation and enquiry, for example via Slack, Zapier or Make.

## Deploying to Vercel

1. In Vercel, choose **Add New → Project**, import the GitHub repository and keep the detected **Next.js** settings.
2. Under **Storage**, create or connect a Redis database (Upstash for Redis, or Vercel's Redis) to this project, for all environments. The site detects it automatically from `KV_REST_API_URL`/`KV_REST_API_TOKEN`, `UPSTASH_REDIS_REST_URL`/`_TOKEN`, `REDIS_URL` or `KV_URL`, including any custom prefix Vercel adds (e.g. `STORAGE_KV_REST_API_URL`). Orders, payment confirmations, enquiries, newsletter signups and live chats are stored there. **Without it, orders are lost and live chat is disabled.** To check, open `/admin/login`: it shows whether a database is connected.
3. Under **Settings → Environment Variables**, set `NEXT_PUBLIC_SITE_URL` (e.g. `https://your-project.vercel.app`, or your own domain later) and, optionally, `NOTIFICATION_WEBHOOK_URL`.
4. Redeploy. To view orders, open the Upstash console's Data Browser and look at the `order:*` keys and the `orders` / `enquiries` lists.

On Vercel, payment screenshot uploads keep only their metadata (file name, type and size). To store the files themselves, connect object storage such as Vercel Blob.

## Live chat & team inbox

Each public page has a chat button in the bottom-right corner.

- **Assistant:** a rule-based helper (`src/lib/chat/bot.ts`) answers common questions about services, prices, payment, delivery and refunds, using only the site's own data. It never invents answers. Anything it can't handle, or any request for a person, goes to the team.
- **Team inbox:** teammates sign in at **`/admin`** to see conversations, reply in real time, and close or reopen chats. The "Needs team" tab lists visitors who are waiting, and the browser tab title shows how many need attention. Visitors see the teammate's name on each reply.
- **Visitor details:** when a visitor asks for a person, they're asked for their name and email, so you can follow up by email if they leave.
- **Notifications:** if `NOTIFICATION_WEBHOOK_URL` is set, a notification is sent when a visitor asks for a person and for each new visitor message in a team conversation.

Setup (in Vercel → Settings → Environment Variables, then redeploy):

| Variable | Example |
| --- | --- |
| `CHAT_AGENTS` | `Ali:a-long-password,Sara:another-long-password` |
| `CHAT_SESSION_SECRET` | output of `openssl rand -hex 32` |

To add or remove a teammate, edit `CHAT_AGENTS` and redeploy. Removing someone signs them out immediately. Chats are stored in the same Upstash Redis database as orders.

## Security

- Server-side validation and sanitisation on every endpoint, sharing its rules with the client-side validation
- Same-origin check, per-IP rate limiting, honeypot field and minimum time-to-submit
- Upload type, size and magic-byte checks
- Security headers, plus `noindex` and `no-store` on checkout and payment pages
- No secrets in client code. Only `NEXT_PUBLIC_SITE_URL` is public.
