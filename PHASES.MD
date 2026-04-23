PHASE 1: Setup

Tasks:

1. Install dependencies:

   * zod
   * jsonwebtoken
   * bcrypt
   * cookie
   * react-hook-form
   * lucide-react

2. Initialize shadcn/ui

3. Setup folder structure:

   * /lib
   * /repositories
   * /services
   * /validators
   * /app/api

4. Create utilities:

   * JWT (sign/verify)
   * password hashing

5. Setup env variables

Output:

* Clean project structure
* Base utilities ready

Then:

* Update AGENTS.md
* Move to PHASE 2



PHASE 2: Database Schema

Create migrations using node-pg-migrate:

1. ENUMS:

   * user_role
   * order_status

2. Tables:

   * users
   * categories
   * products (with category_id FK)
   * product_media
   * orders
   * order_items
   * promotions

Requirements:

* Add indexes (phone, category_id, status)
* Add foreign keys
* Use transactions where needed

Then:

* Run migrations
* Document schema in AGENTS.md
* Move to PHASE 3



PHASE 3: Auth & Super Admin

Build:

1. Login API
2. JWT issuance (12h)
3. Auth middleware
4. Role guard

Super Admin APIs:

* create admin
* update admin
* delete admin
* list/search admins

Security:

* bcrypt password hashing
* zod validation

Then:

* Update AGENTS.md
* Move to PHASE 4


PHASE 4: Catalog Management

Categories:

* create
* update
* delete
* list

Products:

* create
* update
* delete
* list

Media:

* upload to Supabase
* enforce 5 images + 1 video

Architecture:

* repository → SQL
* service → logic
* API → handlers

Then:

* Update AGENTS.md
* Move to PHASE 5


PHASE 5: Orders

Public:

* create order

  * insert into orders
  * insert into order_items (transaction)

* get order by phone + order_id

Admin:

* list orders (filters: status, phone)
* update status
* update tracking_text

Then:

* Update AGENTS.md
* Move to PHASE 6


PHASE 6: Promotions

* upload banner (Supabase)
* set sort_order
* toggle active
* set redirect URL

Then:

* Update AGENTS.md
* Move to PHASE 7


PHASE 7: Admin UI

Build:

* login page
* admin management (super admin)
* categories UI
* products UI
* orders UI
* promotions UI

Use:

* shadcn/ui
* react-hook-form

Then:

* Update AGENTS.md
* Move to PHASE 8


PHASE 8: Public UI

Pages:

* Home (banner + products)
* Search (category + price filter)
* Product detail (media carousel)
* Purchase
* Order status

Focus:

* mobile-first
* fast loading
* pagination

Then:

* Update AGENTS.md
* Move to PHASE 9


PHASE 9: Production Hardening

* validation everywhere
* error boundaries
* DB performance tuning (indexes)
* rate limiting
* basic SEO

Finalize AGENTS.md
