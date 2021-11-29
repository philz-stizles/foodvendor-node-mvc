const { dbPool } = require('../db');
const logger = require('../logger');

const TABLE_NAME = 'Menus';
const NAMESPACE = TABLE_NAME;
// eslint-disable-next-line prefer-destructuring
const DB_NAME = process.env.DB_NAME;

class Menu {
  constructor(obj) {
    this.username = obj.username;
    this.email = obj.email;
    this.password = obj.password;
    this.avatar = obj.avatar || null;
    this.isActive = obj.isActive || true;
    this.createdAt = obj.createdAt || new Date();
  }

  async save() {
    try {
      const query = `INSERT INTO ${DB_NAME}.${TABLE_NAME} (username, email, password, avatar, isActive, createdAt) VALUES(?, ?, ?, ?, ?, ?);`;
      // execute will internally call prepare and query
      logger.info(NAMESPACE, 'Inserting user');
      return await dbPool.execute(query, [
        this.username,
        this.email,
        this.password,
        this.imageUrl,
        this.isActive,
        this.createdAt,
      ]);
    } catch (error) {
      logger.error(TABLE_NAME, error.message);
      throw error;
    }
  }

  static async getAll() {
    try {
      const query = `SELECT username, email, avatar, isActive, createdAt FROM ${DB_NAME}.${TABLE_NAME}`;

      logger.info(NAMESPACE, 'Getting all users.');

      return await dbPool.execute(query);
    } catch (error) {
      logger.error(TABLE_NAME, error.message);
      throw error;
    }
  }

  static async getById(id) {
    try {
      const query = `SELECT title, content, createdAt FROM ${DB_NAME}.${TABLE_NAME} WHERE id=?`;

      return await dbPool.execute(query, [id]);
    } catch (error) {
      logger.error(TABLE_NAME, error.message);
      throw error;
    }
  }
}

module.exports = Menu;
