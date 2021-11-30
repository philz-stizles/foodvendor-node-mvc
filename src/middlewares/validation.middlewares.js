const AppError = require('../errors/app.error');

exports.signupValidator = (req, _, next) => {
  const { email, username, password } = req.body;
  if (!email || !username || !password)
    return next(new AppError(400, 'Please fill all the required fields'));

  next();
};

exports.loginValidator = (req, _, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError(400, 'Please provide an email and a password'));

  next();
};
