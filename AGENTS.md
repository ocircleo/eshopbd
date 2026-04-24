<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md

## Project: E-commerce System

---

## Tech Stack

* Next.js
* PostgreSQL (Supabase)
* Supabase Storage
* node-pg-migrate
* Tailwind + shadcn/ui

---

## Completed Phases

PHASE 1
PHASE 2
PHASE 3
PHASE 4
PHASE 5
PHASE 6
PHASE 7
PHASE 8
PHASE 9
PHASE 10 (Component Conversion & UUID Migration)

---

## Current Phase

PHASE 10 (Final)

---

## Next Phase

PHASE 10 (Final)

---

## Database Schema (Reference Only)

⚠ Source of truth = migrations

### Tables

users

* id (UUID)
* name
* email
* phone (unique)
* password_hash
* role (ENUM: admin, super_admin)

categories

* id (UUID)
* name

products

* id (UUID)
* title
* price
* category_id (FK UUID)
* short_description
* details (TEXT/JSONB)

product_media

* id (UUID)
* product_id (FK UUID)
* type (image/video)
* url
* sort_order

orders

* id (UUID)
* name
* phone
* address
* status (ENUM)
* note
* tracking_text

order_items

* id (UUID)
* order_id (FK UUID)
* product_id (FK UUID)
* quantity
* price_at_purchase

promotions

* id (UUID)
* image_url
* redirect_url
* sort_order
* is_active

---

## Status Flow

pending → confirmed → shipped → delivered
or canceled / rejected

---

## Conventions

* JWT in httpOnly cookies
* Use transactions for multi-step operations
* Media stored in Supabase

---

## Constraints

* Max 5 images + 1 video per product

---

## Production Hardening Completed

* ✅ Validation everywhere (Zod schemas for all inputs)
* ✅ Error boundaries (global React error boundary)
* ✅ DB performance tuning (comprehensive indexes added)
* ✅ Rate limiting (5 orders/hour, 20 status checks/hour, 5 login attempts/15min)
* ✅ Basic SEO (metadata, robots.txt, sitemap.xml)

---

## Final Notes

This e-commerce system is now production-ready with:

- Complete admin panel for managing catalog, orders, promotions
- Public shopping experience with search and purchase
- Order tracking by phone + ID
- Secure authentication with role-based access
- Comprehensive validation and error handling
- Performance optimizations and rate limiting
- SEO-friendly structure
- UUID primary keys for all tables
- JavaScript/JSX components (converted from TypeScript)

The system follows strict layered architecture and is fully documented.

