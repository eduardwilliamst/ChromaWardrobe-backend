import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  searchPinterest,
  getBoardPins
} from '../controllers/pinterestController';
import {
  pinterestSearchValidator,
  pinterestBoardValidator
} from '../middleware/validators';

const router = Router();

// Rate limiter for Pinterest API calls (max 30 requests per 15 minutes per IP)
const pinterestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  message: {
    success: false,
    message: 'Too many Pinterest API requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Apply rate limiter to all Pinterest routes
router.use(pinterestLimiter);

// POST /api/pinterest/search - Search Pinterest for fashion inspiration
router.post('/search', pinterestSearchValidator, searchPinterest);

// POST /api/pinterest/board - Get pins from a Pinterest board
router.post('/board', pinterestBoardValidator, getBoardPins);

export default router;
