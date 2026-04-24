exports.up = (pgm) => {
  pgm.createExtension('uuid-ossp', { ifNotExists: true });

  pgm.addColumn('categories', {
    new_id: {
      type: 'uuid',
      notNull: true,
      default: pgm.func('gen_random_uuid()'),
    },
  });

  pgm.addColumn('products', {
    new_id: {
      type: 'uuid',
      notNull: true,
      default: pgm.func('gen_random_uuid()'),
    },
    new_category_id: {
      type: 'uuid',
    },
  });

  pgm.addColumn('product_media', {
    new_id: {
      type: 'uuid',
      notNull: true,
      default: pgm.func('gen_random_uuid()'),
    },
    new_product_id: {
      type: 'uuid',
      notNull: true,
    },
  });

  pgm.addColumn('orders', {
    new_id: {
      type: 'uuid',
      notNull: true,
      default: pgm.func('gen_random_uuid()'),
    },
  });

  pgm.addColumn('order_items', {
    new_id: {
      type: 'uuid',
      notNull: true,
      default: pgm.func('gen_random_uuid()'),
    },
    new_order_id: {
      type: 'uuid',
      notNull: true,
    },
    new_product_id: {
      type: 'uuid',
      notNull: true,
    },
  });

  pgm.addColumn('promotions', {
    new_id: {
      type: 'uuid',
      notNull: true,
      default: pgm.func('gen_random_uuid()'),
    },
  });

  pgm.addColumn('users', {
    new_id: {
      type: 'uuid',
      notNull: true,
      default: pgm.func('gen_random_uuid()'),
    },
  });

  pgm.sql(`
    UPDATE products
    SET new_category_id = categories.new_id
    FROM categories
    WHERE products.category_id = categories.id;

    UPDATE product_media
    SET new_product_id = products.new_id
    FROM products
    WHERE product_media.product_id = products.id;

    UPDATE order_items
    SET new_product_id = products.new_id
    FROM products
    WHERE order_items.product_id = products.id;

    UPDATE order_items
    SET new_order_id = orders.new_id
    FROM orders
    WHERE order_items.order_id = orders.id;
  `);

  pgm.sql(`
    ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_id_fkey;
    ALTER TABLE product_media DROP CONSTRAINT IF EXISTS product_media_product_id_fkey;
    ALTER TABLE order_items DROP CONSTRAINT IF EXISTS order_items_order_id_fkey;
    ALTER TABLE order_items DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;

    ALTER TABLE categories DROP CONSTRAINT IF EXISTS categories_pkey;
    ALTER TABLE products DROP CONSTRAINT IF EXISTS products_pkey;
    ALTER TABLE product_media DROP CONSTRAINT IF EXISTS product_media_pkey;
    ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_pkey;
    ALTER TABLE order_items DROP CONSTRAINT IF EXISTS order_items_pkey;
    ALTER TABLE promotions DROP CONSTRAINT IF EXISTS promotions_pkey;
    ALTER TABLE users DROP CONSTRAINT IF EXISTS users_pkey;
  `);

  pgm.sql(`
    ALTER TABLE categories DROP COLUMN id;
    ALTER TABLE categories RENAME COLUMN new_id TO id;
    ALTER TABLE categories ADD PRIMARY KEY (id);

    ALTER TABLE products DROP COLUMN category_id;
    ALTER TABLE products DROP COLUMN id;
    ALTER TABLE products RENAME COLUMN new_id TO id;
    ALTER TABLE products RENAME COLUMN new_category_id TO category_id;
    ALTER TABLE products ADD PRIMARY KEY (id);
    ALTER TABLE products ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES categories(id);

    ALTER TABLE product_media DROP COLUMN product_id;
    ALTER TABLE product_media DROP COLUMN id;
    ALTER TABLE product_media RENAME COLUMN new_id TO id;
    ALTER TABLE product_media RENAME COLUMN new_product_id TO product_id;
    ALTER TABLE product_media ADD PRIMARY KEY (id);
    ALTER TABLE product_media ADD CONSTRAINT product_media_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id);

    ALTER TABLE orders DROP COLUMN id;
    ALTER TABLE orders RENAME COLUMN new_id TO id;
    ALTER TABLE orders ADD PRIMARY KEY (id);

    ALTER TABLE order_items DROP COLUMN product_id;
    ALTER TABLE order_items DROP COLUMN order_id;
    ALTER TABLE order_items DROP COLUMN id;
    ALTER TABLE order_items RENAME COLUMN new_id TO id;
    ALTER TABLE order_items RENAME COLUMN new_product_id TO product_id;
    ALTER TABLE order_items RENAME COLUMN new_order_id TO order_id;
    ALTER TABLE order_items ADD PRIMARY KEY (id);
    ALTER TABLE order_items ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id);
    ALTER TABLE order_items ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders(id);

    ALTER TABLE promotions DROP COLUMN id;
    ALTER TABLE promotions RENAME COLUMN new_id TO id;
    ALTER TABLE promotions ADD PRIMARY KEY (id);

    ALTER TABLE users DROP COLUMN id;
    ALTER TABLE users RENAME COLUMN new_id TO id;
    ALTER TABLE users ADD PRIMARY KEY (id);
  `);

  pgm.sql(`
    CREATE INDEX products_category_id_idx ON products(category_id);
    CREATE INDEX order_items_order_id_idx ON order_items(order_id);
    CREATE INDEX order_items_product_id_idx ON order_items(product_id);
    CREATE INDEX product_media_product_id_idx ON product_media(product_id);
  `);
};

exports.down = (pgm) => {
  throw new Error('Downgrade is not supported for UUID migration');
};
