// export default () => {
//   const database = {
//     type: process.env.DATABASE_TYPE,
//     host: process.env.DATABASE_HOST,
//     port: parseInt(process.env.DATABASE_PORT),
//     username: process.env.DATABASE_USERNAME,
//     password: process.env.DATABASE_PASSWORD,
//     database: process.env.DATABASE_NAME,
//     entities: ['dist/**/*.entity{.js, .ts}'],
//     synchronize: false, //always be false for production
//     logging: true,
//     migrationsRun: true,
//     migrations: ['dist/migrations/*{.js, .ts}'],
//   };
//   console.log('database = ', database);
//   return { database };
// };

export default () => {
  let database = {
    host: 'localhost',
    port: 5432,
    type: 'postgres',
    username: 'postgres',
    password: 'root',
    database: 'test',
    migrationsRun: true,
    logging: true,
    migrations: ['dist/migrations/*{.ts,.js}'],
    entities: ['dist/**/*.entity{.ts,.js}'],
  };
  return {
    database,
  };
};