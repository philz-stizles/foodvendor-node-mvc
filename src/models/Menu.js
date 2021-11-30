const { db } = require('../db');
const logger = require('../logger');

const TABLE_NAME = 'Menus';
const NAMESPACE = TABLE_NAME;
// eslint-disable-next-line prefer-destructuring
const DB_NAME = process.env.DB_NAME;

class Menu {
  constructor(obj) {
    this.creator = obj.creator;
    this.name = obj.name;
    this.description = obj.description;
    this.imageUrl = obj.imageUrl || null;
    this.createdAt = obj.createdAt || new Date();
  }

  async save() {
    try {
      const query = `INSERT INTO ${DB_NAME}.${TABLE_NAME} (creator, name, description, imageUrl, createdAt) VALUES(?, ?, ?, ?, ?);`;
      const [rows] = await db.execute(query, [
        this.creator,
        this.name,
        this.description,
        this.imageUrl,
        this.createdAt,
      ]);
      return rows.insertId;
    } catch (error) {
      logger.error(TABLE_NAME, error.message);
      throw error;
    }
  }

  static async find() {
    try {
      const query = `SELECT creator, name, description, imageUrl, createdAt FROM ${DB_NAME}.${TABLE_NAME}`;

      return await db.execute(query)[0];
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

      const query = `SELECT title, content, createdAt FROM ${DB_NAME}.${TABLE_NAME} WHERE ${where}`;
      const [rows] = await db.execute(query, Object.values(match));
      return rows[0];
    } catch (error) {
      logger.error(NAMESPACE, error.message);
      throw error;
    }
  }

  static async exists(match) {
    try {
      const where = Object.keys(match)
        .map((key) => `${key}=?`)
        .join(` OR `);
      const query = `SELECT id FROM ${DB_NAME}.${TABLE_NAME} WHERE ${where}`;
      const [rows] = await db.execute(query, Object.values(match));
      return rows.length > 0;
    } catch (error) {
      logger.error(NAMESPACE, error.message);
      throw error;
    }
  }
}

module.exports = Menu;
