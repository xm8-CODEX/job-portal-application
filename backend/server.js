require('dotenv').config();
const app = require('./src/app');
const { connectDB, sequelize } = require('./src/config/db');
require('./src/models'); // registers associations

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  // sync() creates tables if they don't exist - fine for dev, use migrations in production
  await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
  });
};

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
