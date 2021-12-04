const express = require('express');

const {
  getOverView,
  getSignupView,
  getLoginView,
  getMenusView,
  getCartView,
  getMyMenusView,
  updateMyMenuView,
  deleteMyMenuView,
  getMenuView,
  getMyOrdersView,
  getMyCategoriesView,
  getMyCouponsView,
  getDashboardView,
} = require('../../controllers/view.controllers');
const { alerts } = require('../../middlewares/alert.middleware');
const {
  authenticateView,
  preventAuthAccess,
  preventPublicAccess,
} = require('../../middlewares/auth.middlewares');

const router = express.Router();

router.use(alerts);
router.use(authenticateView);

router.get('/', getOverView);
router.get('/signup', preventAuthAccess, getSignupView);
router.get('/login', preventAuthAccess, getLoginView);

// Cart.
router.route('/cart').get(preventPublicAccess, getCartView);

// Dashboard.
router.route('/dashboard').get(preventPublicAccess, getDashboardView);

// Menus.
router.route('/menus').get(preventPublicAccess, getMenusView);

router.route('/menus/me').get(getMyMenusView);

router
  .route('/menus/me/:id')
  .put(preventPublicAccess, updateMyMenuView)
  .delete(preventPublicAccess, deleteMyMenuView);

router.get('/menus/:slug', getMenuView);

// Orders.
router.route('/orders/me').get(preventPublicAccess, getMyOrdersView);

router.route('/categories/me').get(preventPublicAccess, getMyCategoriesView);

router.route('/coupons/me').get(preventPublicAccess, getMyCouponsView);

// router.get('/stats', authenticate, getStatsView);
// // router.post('/update-user', authenticate, updateUser)
// router.patch('/update-user', authenticate, updateUser);
// router.patch('/update-password', authenticate, updateUser);
// router.get('/my-tours', authenticate, getMyToursView);
// router.get('/my-tours', createBookingCheckout, authenticate, getMyToursView)

module.exports = router;
