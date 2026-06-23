import express from 'express';
import {
  getTables,
  getTableById,
  createTable,
  updateTable,
  deleteTable,
  updateTableStatus,
  getAvailableTables
} from '../controllers/tableController.js';
import { protect, authorize } from '../middleware/auth.js';
import { cacheMiddleware } from '../config/redis.js';

const router = express.Router();

// Public routes
router.get('/available', cacheMiddleware(60), getAvailableTables);

// Protected routes
router.use(protect);

router.get('/', authorize('admin', 'waiter'), getTables);
router.get('/:id', authorize('admin', 'waiter'), getTableById);
router.post('/', authorize('admin'), createTable);
router.put('/:id', authorize('admin'), updateTable);
router.delete('/:id', authorize('admin'), deleteTable);
router.patch('/:id/status', authorize('admin', 'waiter'), updateTableStatus);

export default router;