const AppError = require('../errors/app.error');
const User = require('../models/User');
const { verifyTokenAsync } = require('../services/security/jwt.services');

exports.isAuthenticated = async (req, res, next) => {
  try {
    // Check if token exists.
    let token = '';
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
      // eslint-disable-next-line prefer-destructuring
      token = req.cookies.token;
    }

    if (!token)
      return next(new AppError(401, 'You are not logged in. Please log'));

    // Check if token is valid
    const decodedToken = await verifyTokenAsync(token);
    if (!decodedToken)
      return next(new AppError(401, 'You are not authorized. Please sign up'));

    // Retrieve user if user exists.
    const existingUser = await User.findOne({
      id: decodedToken.id,
    });
    if (!existingUser)
      return next(
        new AppError(
          401,
          'You no longer have access to this resource. Please sign up',
        ),
      );
    // Grant access to protected routes.
    req.user = existingUser;
    res.locals.user = existingUser; // For view
    res.locals.isAuthenticated = true; // For view

    return next();
  } catch (error) {
    return next(
      new AppError(
        500,
        'You cannot access this resource at the moment. Please try again later',
      ),
    );
  }
};

exports.isAuthorized = (...authorizedRoles) => async (req, res, next) => {
  if (!authorizedRoles.includes(req.user.role)) {
    return next(
      new AppError(
        403,
        'You do not have the permission to perform this action',
      ),
    );
  }

  return next();
};

exports.authenticateView = async (req, res, next) => {
  try {
    if (req.cookies.token) {
      // Check if token is valid
      const decodedToken = await verifyTokenAsync(req.cookies.token);
      if (!decodedToken) {
        return next();
      }

      // Check if user exists(or if a previously existing user with a valid token has been deleted)
      // and return user if true
      // Retrieve user if user exists.
      const existingUser = await User.findOne({
        id: decodedToken.id,
      });
      if (!existingUser)
        return next(
          new AppError(
            401,
            'You no longer have access to this resource. Please sign up',
          ),
        );

      // Grant access to protected route
      res.locals.user = existingUser;
      res.locals.isAuthenticated = true;

      return next();
    }

    next();
  } catch (error) {
    return next();
  }
};

exports.IsPrivateView = async (req, res, next) => {
  try {
    // If user is authenticated.
    if (res.locals.isAuthenticated) {
      // Render home page.
      res.render('overview', { title: 'All Menus' });
    } else {
      // Render signup page.
      res.render('signup', { title: 'Sign up for a free account' });
    }
  } catch (error) {
    return next();
  }
};

exports.preventAuthAccess = async (req, res, next) => {
  try {
    // If user is authenticated.
    if (res.locals.isAuthenticated) {
      // Render home page.
      return res.redirect('back');
    }
    next();
  } catch (error) {
    return next(error);
  }
};

exports.preventPublicAccess = async (req, res, next) => {
  try {
    console.log('prevent public access', res.locals.isAuthenticated);
    // If user is authenticated.
    if (!res.locals.isAuthenticated) {
      // Render home page.
      return res.redirect('/login');
    }
    next();
  } catch (error) {
    return next(error);
  }
};
