import express from 'express';
import { processPayment, getPaymentStatus } from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/process', processPayment);
router.get('/status/:transactionId', getPaymentStatus);

export default router;