const express = require('express');
const {
  getCheckoutSession,
  getOrders,
  updateOrder,
  cancelOrder,
  getOrder,
} = require('../../controllers/order.controllers');
const { isAuthenticated } = require('../../middlewares/auth.middlewares');

const router = express.Router();

// Authenticate all routes after this middleware
router.use(isAuthenticated);

router.get('/checkoutSession/:menuId', getCheckoutSession);

router.route('/').get(getOrders);

router.route('/:id').patch(updateOrder).get(getOrder).delete(cancelOrder);

module.exports = router;
