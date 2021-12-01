/* eslint-disable no-console */
const http = require('http');
require('../dotenv-config');
const expressApp = require('./app');
const { connectToDB } = require('./db/index');

const startUp = async (app) => {
  const host = process.env.DB_HOST;
  const user = process.env.DB_USERNAME;
  const pass = process.env.DB_PASSWORD;
  const db = process.env.DB_NAME;

  if (!process.env.JWT_AUTH_SECRET) {
    throw new Error('JWT_AUTH_SECRET must be defined');
  }

  // if (!process.env.DATABASE_URI) {
  //   throw new Error('DATABASE_URI must be defined');
  // }

  if (!host || !user || !pass || !db) {
    throw new Error('Database configurations must be defined');
  }

  if (!process.env.PORT) {
    throw new Error('PORT must be defined');
  }

  // Connect to database.
  await connectToDB();

  // initialize http server
  const httpServer = http.createServer(app);

  const PORT = parseInt(process.env.PORT, 10);
  const server = httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on ${PORT} ${process.env.NODE_ENV}`);
    console.log(`🚀 Website @ http://localhost`);
    console.log(`🚀 API Docs @ http://localhost:${PORT}/api-docs`);
  });

  process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });

  process.on('SIGTERM', () => {
    console.log('SIGTERM RECEIVED. Shutting down gracefully...');
    server.close(() => {
      console.log('💥 Process terminated!');
    });
  });
};

startUp(expressApp);
