/* eslint-disable import/no-default-export */
export default {
  client: 'postgresql',
  connection: process.env.DATABASE_URL,
  migrations: {
    tableName: 'knex_migrations',
    directory: './src/knexMigrations',
  },
  seeds: {
    directory: './src/knexSeeds',
  },
};
