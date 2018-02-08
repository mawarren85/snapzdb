
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', (table) => {
  table.increments();
  table.string('email').unique().notNullable();
  table.specificType('hashed_password', 'char(60)').notNullable();
  table.string('name');
  table.string('profile_photo');
  table.integer('points');
});
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
