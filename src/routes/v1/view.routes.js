const express = require('express');

const {
  getOverView,
  getSignupView,
  getLoginView,
  getMenusView,
  createMyMenuView,
  getMyMenusView,
  updateMyMenuView,
  deleteMyMenuView,
  getMenuView,
  getDashboardView,
} = require('../../controllers/view.controllers');
const { alerts } = require('../../middlewares/alert.middleware');
const {
  authenticateView,
  isAuthenticated,
} = require('../../middlewares/auth.middlewares');

const router = express.Router();

router.use(alerts);

router.get('/', authenticateView, getOverView);
router.get('/signup', authenticateView, getSignupView);
router.get('/login', authenticateView, getLoginView);

router.route('/menus').get(authenticateView, getMenusView);

router
  .route('/menus/me')
  .post(authenticateView, createMyMenuView)
  .get(authenticateView, getMyMenusView);

router
  .route('/menus/me/:id')
  .put(authenticateView, updateMyMenuView)
  .delete(authenticateView, deleteMyMenuView);

router.get('/menus/:slug', authenticateView, getMenuView);
router.get('/dashboard', isAuthenticated, getDashboardView);
// router.get('/stats', authenticate, getStatsView);
// // router.post('/update-user', authenticate, updateUser)
// router.patch('/update-user', authenticate, updateUser);
// router.patch('/update-password', authenticate, updateUser);
// router.get('/my-tours', authenticate, getMyToursView);
// router.get('/my-tours', createBookingCheckout, authenticate, getMyToursView)

module.exports = router;
