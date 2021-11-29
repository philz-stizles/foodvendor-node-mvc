const mysql = require('mysql2');
const createQuery = require('./initialize');
const logger = require('../logger');

let dbPool;

// eslint-disable-next-line no-unused-vars
const connectToDB = ({ host, user, pass: password, db }) => {
  const pool = mysql.createPool({
    host,
    user,
    password,
    multipleStatements: true,
  });
  logger.info(createQuery);

  // eslint-disable-next-line no-unused-vars
  pool.query(createQuery, (error, results, fields) => {
    if (error) {
      logger.error('DB Index', error.message);
    }
    logger.info('DB Index', 'Database, tables created & seeded');
  });

  dbPool = pool.promise();
};

module.exports = { connectToDB, dbPool };

// pool.on('connect', () => {
//   console.log(
//     process.env.PG_HOST,
//     process.env.PG_USER,
//     process.env.PG_DB,
//     process.env.PG_PASSWORD
//   );
//   console.log('Database connected successfully!');
// });

// pool.on('error', (err, client) => {
//   console.error('Error: ', err.message);
// });

// export default {
//   query: (
//     text: string,
//     params: any,
//     callback: (err: Error, result: QueryResult<any>) => any
//   ): any => {
//     return pool.query(text, params, callback);
//     // return pool.query(text, params);
//   },
//   transaction: async (command: string) => await pool.query(command),
// };
