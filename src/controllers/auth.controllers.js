const logger = require('../logger');
const AppError = require('../errors/app.error');
const {
  hashPasswordAsync,
  validatePasswordAsync,
} = require('../services/security/password.services');
const User = require('../models/User');
const { createAndSendTokenWithCookie } = require('../utils/api.utils');

const NAMESPACE = 'AUTH CONTROLLER';

exports.signup = async (req, res, next) => {
  try {
    const { username, email, password, type } = req.body;
    logger.error(NAMESPACE, username);
    // Check if user already exists.
    const userExists = await User.exists(username, email);
    if (userExists) return next(new AppError(400, 'User already exists'));

    // Generate hashed password.
    const hashedPassword = await hashPasswordAsync(password);

    // Initialize new user.
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: type.toLowerCase(),
    });

    // Save new user.
    await newUser.save();

    res.status(201).json({
      status: true,
      data: {
        username,
        email,
      },
      message: 'created successfully',
    });
  } catch (error) {
    logger.error(NAMESPACE, error.message);
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return next(new AppError(401, 'Incorrect email or password'));

    // Check if password matches
    const isMatch = await validatePasswordAsync(
      password,
      existingUser.password,
    );
    if (!isMatch) return next(new AppError(401, 'Incorrect email or password'));

    createAndSendTokenWithCookie(existingUser, req, res);
  } catch (error) {
    logger.error(NAMESPACE, error.message);
    next(error);
  }
};

exports.logoutCookie = async (req, res, next) => {
  res.cookie('token', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.json({ status: true, message: 'Logout successful' });
};
