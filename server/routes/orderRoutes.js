import express from 'express';
import {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
    updateItemStatus,
    cancelOrder
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';
import { orderLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();
// All routes are protected
router.use(protect);

// Customer routes
router.post('/', orderLimiter, createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);

// Staff only routes
router.put(
  '/:id/status',
  authorize('admin', 'waiter', 'kitchen', 'cashier'),
  updateOrderStatus
);

router.put(
  '/:id/items/:itemId/status',
  authorize('admin', 'kitchen'),
  updateItemStatus
);

export default router;