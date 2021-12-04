const { db } = require('../db');
const logger = require('../logger');

const TABLE_NAME = 'Users';
const NAMESPACE = TABLE_NAME;
// eslint-disable-next-line prefer-destructuring
const DB_NAME = process.env.DB_NAME;

class User {
  constructor(obj) {
    this.username = obj.username;
    this.email = obj.email;
    this.password = obj.password;
    this.avatar = obj.avatar || null;
    this.isActive = obj.isActive || true;
    this.role = obj.role;
    this.createdAt = obj.createdAt || new Date();
  }

  async save() {
    try {
      const query = `INSERT INTO ${DB_NAME}.${TABLE_NAME}(username, email, password, avatar, isActive, role, createdAt) VALUES(?, ?, ?, ?, ?, ?, ?);`;

      return await db.execute(query, [
        this.username,
        this.email,
        this.password,
        this.avatar,
        this.isActive,
        this.role,
        this.createdAt,
      ]);
    } catch (error) {
      logger.error(NAMESPACE, error.message);
      throw error;
    }
  }

  static async find(match) {
    try {
      const matchIsObject =
        match && typeof match === 'object' && Object.keys(match).length !== 0;
      const where = matchIsObject
        ? ` WHERE ${Object.keys(match)
            .map((key) => `${key}=?`)
            .join(' AND ')}`
        : '';
      const values = matchIsObject ? Object.values(match) : [];

      const query = `SELECT username, email, avatar, isActive, createdAt FROM ${DB_NAME}.${TABLE_NAME}${where}`;

      logger.info(NAMESPACE, 'Getting all users.');
      const [rows] = await db.execute(query, values);
      return rows;
    } catch (error) {
      logger.error(NAMESPACE, error.message);
      throw error;
    }
  }

  static async findOne(match) {
    try {
      const where = Object.keys(match)
        .map((key) => `${key}=?`)
        .join(` AND `);

      const query = `SELECT id, username, email, password, role FROM ${DB_NAME}.${TABLE_NAME} WHERE ${where}`;
      const [rows] = await db.execute(query, Object.values(match));
      return rows[0];
    } catch (error) {
      logger.error(NAMESPACE, error.message);
      throw error;
    }
  }

  static async exists(username, email) {
    try {
      const query = `SELECT id FROM ${DB_NAME}.${TABLE_NAME} WHERE username=? OR email=?`;
      const [rows] = await db.execute(query, [username, email]);
      return rows.length > 0;
    } catch (error) {
      logger.error(NAMESPACE, error.message);
      throw error;
    }
  }
}

module.exports = User;
