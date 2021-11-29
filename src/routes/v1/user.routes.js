const express = require('express');
const router = express.Router();
const {
  createUser,
  updateMe,
  getAllUsers,
  getMe,
  deleteMe,
  changePassword,
  getUser,
  deleteUser,
  updateUser,
} = require('../../controllers/userControllers');
const {
  uploadUserPhoto,
  resizeUserPhoto,
} = require('../../middlewares/multerMiddlewares');
const {
  isAuthenticated,
  isAuthorized,
} = require('../../middlewares/auth.middlewares');

// Authenticate all routes after this middleware
router.use(isAuthenticated);

router
  .route('/me')
  .get(getMe)
  .patch(uploadUserPhoto, resizeUserPhoto, updateMe)
  .delete(deleteMe);

router.patch('/me/changePassword', changePassword);

// Authorize only admin for all routes after this middleware
router.use(isAuthorized('admin'));

router.route('/').post(createUser).get(getAllUsers);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
