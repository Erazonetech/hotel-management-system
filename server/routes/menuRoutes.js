import express from 'express';
import {
    getAllMenuItems,
    getMenuItemById,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    getCategories,
    getPopularItems,
    toggleAvailability
} from '../controllers/menuController.js';
import { protect, authorize } from '../middleware/auth.js';
import { uploadSingleImage, handleMulterError } from '../middleware/upload.js';
import { cacheMiddleware } from '../config/redis.js';

const router = express.Router();
// Public routes with caching
router.get('/items', cacheMiddleware(300), getAllMenuItems);
router.get('/items/popular', cacheMiddleware(600), getPopularItems);
router.get('/items/:id', cacheMiddleware(300), getMenuItemById);
router.get('/categories', cacheMiddleware(600), getCategories);

// Admin only routes
router.post(
  '/items', 
  protect, 
  authorize('admin'), 
  uploadSingleImage('image'),
  handleMulterError,
  createMenuItem
);

router.put(
  '/items/:id', 
  protect, 
  authorize('admin'), 
  updateMenuItem
);

router.delete(
  '/items/:id', 
  protect, 
  authorize('admin'), 
  deleteMenuItem
);

router.patch(
  '/items/:id/availability',
  protect,
  authorize('admin'),
  toggleAvailability
);

export default router;