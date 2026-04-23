exports.up = (pgm) => {
  // users table
  pgm.createTable('users', {
    id: 'id',
    name: { type: 'varchar', notNull: true },
    email: { type: 'varchar' },
    phone: { type: 'varchar', notNull: true, unique: true },
    password_hash: { type: 'varchar', notNull: true },
    role: { type: 'user_role', notNull: true }
  });

  // categories table
  pgm.createTable('categories', {
    id: 'id',
    name: { type: 'varchar', notNull: true }
  });

  // products table
  pgm.createTable('products', {
    id: 'id',
    title: { type: 'varchar', notNull: true },
    price: { type: 'decimal(10,2)', notNull: true },
    category_id: { type: 'integer', references: 'categories(id)' },
    short_description: { type: 'text' },
    details: { type: 'jsonb' }
  });

  // product_media table
  pgm.createTable('product_media', {
    id: 'id',
    product_id: { type: 'integer', notNull: true, references: 'products(id)' },
    type: { type: 'varchar', notNull: true, check: "type IN ('image','video')" },
    url: { type: 'varchar', notNull: true },
    sort_order: { type: 'integer', default: 0 }
  });

  // orders table
  pgm.createTable('orders', {
    id: 'id',
    name: { type: 'varchar', notNull: true },
    phone: { type: 'varchar', notNull: true },
    address: { type: 'text', notNull: true },
    status: { type: 'order_status', default: 'pending' },
    note: { type: 'text' },
    tracking_text: { type: 'text' }
  });

  // order_items table
  pgm.createTable('order_items', {
    id: 'id',
    order_id: { type: 'integer', notNull: true, references: 'orders(id)' },
    product_id: { type: 'integer', notNull: true, references: 'products(id)' },
    quantity: { type: 'integer', notNull: true },
    price_at_purchase: { type: 'decimal(10,2)', notNull: true }
  });

  // promotions table
  pgm.createTable('promotions', {
    id: 'id',
    image_url: { type: 'varchar', notNull: true },
    redirect_url: { type: 'varchar', notNull: true },
    sort_order: { type: 'integer', default: 0 },
    is_active: { type: 'boolean', default: true }
  });

  // indexes
  pgm.createIndex('users', 'phone');
  pgm.createIndex('products', 'category_id');
  pgm.createIndex('orders', 'status');
};

exports.down = (pgm) => {
  pgm.dropTable('promotions');
  pgm.dropTable('order_items');
  pgm.dropTable('orders');
  pgm.dropTable('product_media');
  pgm.dropTable('products');
  pgm.dropTable('categories');
  pgm.dropTable('users');
};