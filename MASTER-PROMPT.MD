You are building a production-grade e-commerce system using:

* Next.js (App Router)
* PostgreSQL (Supabase)
* Supabase Storage
* node-pg-migrate
* Tailwind + shadcn/ui

## SYSTEM OVERVIEW

This system includes:

1. Admin panel (admin + super_admin)
2. Public shopping experience (no user accounts)
3. Order tracking via phone + order ID

---

## CORE RULES

1. Database schema is defined ONLY via migrations
2. NEVER invent schema — always reference migrations or AGENTS.md
3. Use layered architecture:

   * repository (SQL)
   * service (business logic)
   * API (handlers)
4. Use Zod for validation
5. Use JWT (12h expiry, httpOnly cookie)
6. All features must be complete (DB + API + UI)

---

## AUTH MODEL

* Login via phone + password
* Roles:

  * super_admin → manage admins ONLY
  * admin → full system access

---

## DATABASE PRINCIPLES

* products MUST reference categories
* orders MUST use order_items
* product media stored separately
* use ENUMs for roles and order status
* use indexes for search/filter columns

---

## EXECUTION RULES

You will work in strict PHASES:

* Complete one phase fully
* Update AGENTS.md
* Define next phase

Do NOT skip or merge phases.

If unclear, ask before proceeding.
