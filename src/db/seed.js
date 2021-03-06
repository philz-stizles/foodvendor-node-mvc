const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../models/tourModel');
const Review = require('../models/Review');
const User = require('../models/userModel');

dotenv.config({ path: './config.env' });

// const DB = process.env.DATABASE_LOCAL
const DB = process.env.DATABASE_REMOTE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!'));

// READ JSON FILE
const tours = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'tours.json'), 'utf-8'),
);
const users = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'users.json'), 'utf-8'),
);
const reviews = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'reviews.json'), 'utf-8'),
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await User.create(users, { validateBeforeSave: false }); // You can turn off create/save validation
    await Tour.create(tours);
    await Review.create(reviews);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }

  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }

  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
