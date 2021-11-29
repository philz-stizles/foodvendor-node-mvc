const express = require('express');
const router = express.Router();
const {
    signup,
    login,
    forgotPassword,
    resetPassword,
    changePassword,
    logoutCookie,
} = require('../../controllers/authontrollers');
const {
    loginValidator,
    signupValidator,
} = require('../../middlewares/validationMiddlewares');

router.post('/signup', signupValidator, signup);
router.post('/login', loginValidator, login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/changePassword/:token', changePassword);
router.get('/logout', logoutCookie);

module.exports = router;
