exports.up = (pgm) => {
  pgm.createType('user_role', ['admin', 'super_admin']);
  pgm.createType('order_status', ['pending', 'confirmed', 'shipped', 'delivered', 'canceled', 'rejected']);
};

exports.down = (pgm) => {
  pgm.dropType('order_status');
  pgm.dropType('user_role');
};