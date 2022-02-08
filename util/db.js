const Sequelize = require('sequelize');
const { DATABASE_URL } = require('./config');
const Umzug = require('umzug');

const sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

// const migrationConf = {
//   storage: 'sequelize',
//   storageOptions: {
//     sequelize,
//     tableName: 'migrations',
//   },
//   migrations: {
//     params: [sequelize.getQueryInterface()],
//     path: `${process.cwd()}/migrations`,
//     pattern: /\.js$/,
//   },
// };
const runMigrations = async () => {
  const migrator = new Umzug({
    storage: 'sequelize',
    storageOptions: {
      sequelize,
      tableName: 'migrations',
    },
    migrations: {
      params: [sequelize.getQueryInterface()],
      path: `${process.cwd()}/migrations`,
      pattern: /\.js$/,
    },
  });
  const migrations = await migrator.up();
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.file),
  });
};

// const rollbackMigration = async () => {
//   await sequelize.authenticate();
//   const migrator = new Umzug(migrationConf);
//   await migrator.down();
// };

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    await runMigrations();
    console.log('database connected');
  } catch (err) {
    console.log(err);
    console.log('connecting database failed');
    return process.exit(1);
  }

  return null;
};
module.exports = { connectToDatabase, sequelize };

// const runMigrations = async () => {
//   const migrator = new Umzug({
//     storage: 'sequelize',
//     storageOptions: {
//       sequelize,
//       tableName: 'migrations',
//     },
//     migrations: {
//       params: [sequelize.getQueryInterface()],
//       path: `${process.cwd()}/migrations`,
//       pattern: /\.js$/,
//     },
//   });
//   const migrations = await migrator.up();
//   console.log('Migrations up to date', {
//     files: migrations.map(mig => mig.file),
//   });
// };
// module.exports = { connectToDatabase, sequelize };
