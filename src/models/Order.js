const { db } = require('../db');
const logger = require('../logger');

const TABLE_NAME = 'Orders';
const NAMESPACE = TABLE_NAME;
// eslint-disable-next-line prefer-destructuring
const DB_NAME = process.env.DB_NAME;

class Order {
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

module.exports = Order;

// const mongoose = require('mongoose')

// // Put as much business logic in the models to keep the controllers as simple and lean as possible
// const bookingSchema = new mongoose.Schema({
//     creator: { type: mongoose.Schema.ObjectId, ref: 'Users', required: [true, 'A creator is required'] },
//     tour: { type: mongoose.Schema.ObjectId, ref: 'Tours', required: [true, 'A tour is required'] },
//     price: { type: Number, required: [true, 'Booking must have a price'] },
//     paid: { type: Boolean, default: true }
// }, { timestamps: true });

// bookingSchema.pre(/^find/, function(next) {
//     // this
//     //     .populate({ path: 'tour', select: 'name -_id' }) // First query
//     //     .populate({ path: 'creator', select: 'name photo -_id' }); // Second query // Rather than duplicating the populate query
//     // // for every static method you use to retrieve the Model data, define it as a pre method and it will apply
//     // // for all find queries - findById, findOne etc

//     // It might not be necessary to display Tour, depending on your business model
//     this
//         .populate('creator', 'name')
//         .populate({ path: 'tour', select: 'name' })

//     next()
// })

// module.exports = Booking = mongoose.model('Bookings', bookingSchema);
