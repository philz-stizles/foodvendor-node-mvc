const mysql = require('mysql2');
const createQuery = require('./initialize');
const logger = require('../logger');

const NAMESPACE = 'DB Index';

const host = process.env.DB_HOST;
const user = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

const pool = mysql.createPool({
  host,
  user,
  password,
  waitForConnections: true,
  // connectionLimit: env.DB_CONN_LIMIT || 2,
  queueLimit: 0,
  // debug: env.DB_DEBUG || false,
  multipleStatements: true,
});

const promisifiedPool = pool.promise();

const connectToDB = async () => {
  try {
    // logger.debug(NAMESPACE, createQuery);
    await promisifiedPool.query(createQuery);
    logger.info(NAMESPACE, 'Database, tables created & seeded');
  } catch (error) {
    logger.error(NAMESPACE, error.message);
  }
};

module.exports = {
  connectToDB,
  db: promisifiedPool,
};
