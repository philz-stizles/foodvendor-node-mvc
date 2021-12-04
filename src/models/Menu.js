const { db } = require('../db');
const logger = require('../logger');

const TABLE_NAME = 'Menus';
const NAMESPACE = TABLE_NAME;
// eslint-disable-next-line prefer-destructuring
const DB_NAME = process.env.DB_NAME;

class Menu {
  constructor(obj) {
    console.log(obj);
    this.creator = obj.creator;
    this.name = obj.name;
    this.slug = obj.slug;
    this.description = obj.description;
    this.price = obj.price;
    this.isPublished = obj.isPublished;
    this.imageUrl = obj.imageUrl || null;
    this.createdAt = obj.createdAt || new Date();
  }

  async save() {
    try {
      console.log(this);
      const query = `
        INSERT INTO ${DB_NAME}.${TABLE_NAME} (creator, name, slug, description, price, isPublished, imageUrl, createdAt) 
        VALUES(?, ?, ?, ?, ?, ?, ?, ?);
      `;
      const [rows] = await db.execute(query, [
        this.creator,
        this.name,
        this.slug,
        this.description,
        this.price,
        this.isPublished,
        this.imageUrl,
        this.createdAt,
      ]);
      return rows.insertId;
    } catch (error) {
      logger.error(TABLE_NAME, error.message);
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

      const query = `SELECT creator, name, description, imageUrl, createdAt FROM ${DB_NAME}.${TABLE_NAME}${where}`;

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

      const query = `SELECT title, content, createdAt FROM ${DB_NAME}.${TABLE_NAME} WHERE ${where}`;
      const [rows] = await db.execute(query, Object.values(match));
      return rows[0];
    } catch (error) {
      logger.error(NAMESPACE, error.message);
      throw error;
    }
  }

  static async updateOne(match, updates) {
    try {
      const where = Object.keys(match)
        .map((key) => `${key}=?`)
        .join(` AND `);

      const set = Object.keys(match)
        .map((key) => `${key} = ?`)
        .join(`, `);

      const query = `
        UPDATE ${DB_NAME}.${TABLE_NAME}
        SET ${set}
        WHERE ${where}
      `;
      const [rows] = await db.execute(query, [
        ...Object.values(updates),
        ...Object.values(match),
      ]);
      return rows[0];
    } catch (error) {
      logger.error(NAMESPACE, error.message);
      throw error;
    }
  }

  static async deleteOne(match) {
    try {
      const where = Object.keys(match)
        .map((key) => `${key}=?`)
        .join(` AND `);

      const query = `DELETE FROM ${DB_NAME}.${TABLE_NAME} WHERE ${where}`;
      const [results] = await db.execute(query, Object.values(match));
      return results;
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
