const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  getUserOrders,
} = require('../controllers/orderController');

router.post('/', createOrder);
router.get('/:id', getOrderById);
router.get('/', getAllOrders);
router.get('/user/:userId', getUserOrders);
router.patch('/:id/status', updateOrderStatus);
router.delete('/:id', deleteOrder);

module.exports = router;
