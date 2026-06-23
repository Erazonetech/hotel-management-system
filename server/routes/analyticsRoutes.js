import express from 'express';
import { getDashboardAnalytics, getSalesReport } from '../controllers/analyticsController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All analytics routes require admin access
router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardAnalytics);
router.get('/sales', getSalesReport);

export default router;