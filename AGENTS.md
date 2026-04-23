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

---

## Current Phase

PHASE 5

---

## Next Phase

PHASE 6

---

## Database Schema (Reference Only)

⚠ Source of truth = migrations

### Tables

users

* id
* name
* email
* phone (unique)
* password_hash
* role (ENUM: admin, super_admin)

categories

* id
* name

products

* id
* title
* price
* category_id (FK)
* short_description
* details (TEXT/JSONB)

product_media

* id
* product_id (FK)
* type (image/video)
* url
* sort_order

orders

* id
* name
* phone
* address
* status (ENUM)
* note
* tracking_text

order_items

* id
* order_id (FK)
* product_id (FK)
* quantity
* price_at_purchase

promotions

* id
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

## Pending Decisions

