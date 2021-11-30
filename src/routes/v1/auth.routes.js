const express = require('express');

const router = express.Router();
const {
  signup,
  login,

  logoutCookie,
} = require('../../controllers/auth.controllers');
const {
  loginValidator,
  signupValidator,
} = require('../../middlewares/validation.middlewares');

router.post('/signup', signupValidator, signup);
router.post('/login', loginValidator, login);
router.get('/logout', logoutCookie);

module.exports = router;
