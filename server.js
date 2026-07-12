const app = require('./app');
const { ensureDatabaseExists } = require('./config/database');
const { sequelize } = require('./models');
const seedDatabase = require('./seeders/initialSeed');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // 1. Ensure the MySQL database exists
    await ensureDatabaseExists();

    // 2. Authenticate connection to database
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // 3. Synchronize database tables (alter updates schema if structural changes are detected)
    await sequelize.sync({ alter: true });
    console.log('Database tables synchronized.');

    // 4. Run database seeders
    await seedDatabase();
    console.log('Database seeding finished.');

    // 5. Start listening
    app.listen(PORT, () => {
      console.log(`AssetFlow Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start the AssetFlow server:', error);
    process.exit(1);
  }
}

startServer();
