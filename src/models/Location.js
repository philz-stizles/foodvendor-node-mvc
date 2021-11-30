const { db } = require('../db');
const logger = require('../logger');

const TABLE_NAME = 'Locations';
const NAMESPACE = TABLE_NAME;
// eslint-disable-next-line prefer-destructuring
const DB_NAME = process.env.DB_NAME;

class Location {
  constructor(obj) {
    this.owner = obj.owner;
    this.point = obj.point;
    this.ip = obj.ip;
    this.createdAt = obj.createdAt || new Date();
  }

  async save() {
    try {
      const query = `INSERT INTO ${DB_NAME}.${TABLE_NAME}(owner, coordinate, ip, createdAt) VALUES(?, POINT(? ?), ?, ?);`;

      return await db.execute(query, [
        this.owner,
        this.point.lat,
        this.point.long,
        this.ip,
        this.createdAt,
      ]);
    } catch (error) {
      logger.error(NAMESPACE, error.message);
      throw error;
    }
  }

  static async getAll() {
    try {
      const query = `SELECT username, email, avatar, isActive, createdAt FROM ${DB_NAME}.${TABLE_NAME}`;

      logger.info(NAMESPACE, 'Getting all users.');
      const result = await db(query);
      logger.info(NAMESPACE, result);
    } catch (error) {
      logger.error(NAMESPACE, error.message);
      throw error;
    }
  }

  static async getByOwner(ownerId) {
    try {
      const query = `SELECT owner, coordinate, ip, createdAt FROM ${DB_NAME}.${TABLE_NAME} WHERE owner=?`;

      return await db.execute(query, [ownerId]);
    } catch (error) {
      logger.error(NAMESPACE, error.message);
      throw error;
    }
  }
}

module.exports = Location;
