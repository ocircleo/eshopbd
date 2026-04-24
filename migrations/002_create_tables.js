exports.up = (pgm) => {
  // Enable UUID extension
  pgm.createExtension('uuid-ossp');

  // users table
  pgm.createTable('users', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    name: { type: 'varchar', notNull: true },
    email: { type: 'varchar' },
    phone: { type: 'varchar', notNull: true, unique: true },
    password_hash: { type: 'varchar', notNull: true },
    role: { type: 'user_role', notNull: true }
  });

  // categories table
  pgm.createTable('categories', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    name: { type: 'varchar', notNull: true }
  });

  // products table
  pgm.createTable('products', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    title: { type: 'varchar', notNull: true },
    price: { type: 'decimal(10,2)', notNull: true },
    category_id: { type: 'uuid', references: 'categories(id)' },
    short_description: { type: 'text' },
    details: { type: 'jsonb' }
  });

  // product_media table
  pgm.createTable('product_media', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    product_id: { type: 'uuid', notNull: true, references: 'products(id)' },
    type: { type: 'varchar', notNull: true, check: "type IN ('image','video')" },
    url: { type: 'varchar', notNull: true },
    sort_order: { type: 'integer', default: 0 }
  });

  // orders table
  pgm.createTable('orders', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    name: { type: 'varchar', notNull: true },
    phone: { type: 'varchar', notNull: true },
    address: { type: 'text', notNull: true },
    status: { type: 'order_status', default: 'pending' },
    note: { type: 'text' },
    tracking_text: { type: 'text' }
  });

  // order_items table
  pgm.createTable('order_items', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    order_id: { type: 'uuid', notNull: true, references: 'orders(id)' },
    product_id: { type: 'uuid', notNull: true, references: 'products(id)' },
    quantity: { type: 'integer', notNull: true },
    price_at_purchase: { type: 'decimal(10,2)', notNull: true }
  });

  // promotions table
  pgm.createTable('promotions', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    image_url: { type: 'varchar', notNull: true },
    redirect_url: { type: 'varchar', notNull: true },
    sort_order: { type: 'integer', default: 0 },
    is_active: { type: 'boolean', default: true }
  });

  // indexes
  pgm.createIndex('users', 'phone');
  pgm.createIndex('products', 'category_id');
  pgm.createIndex('products', 'title'); // for search
  pgm.createIndex('products', 'price'); // for price filtering
  pgm.createIndex('orders', 'status');
  pgm.createIndex('orders', 'phone'); // for order lookup
  pgm.createIndex('order_items', 'order_id');
  pgm.createIndex('order_items', 'product_id');
  pgm.createIndex('product_media', 'product_id');
  pgm.createIndex('promotions', 'is_active');
  pgm.createIndex('promotions', 'sort_order');
};

exports.down = (pgm) => {
  pgm.dropTable('promotions');
  pgm.dropTable('order_items');
  pgm.dropTable('orders');
  pgm.dropTable('product_media');
  pgm.dropTable('products');
  pgm.dropTable('categories');
  pgm.dropTable('users');
  pgm.dropExtension('uuid-ossp');
};