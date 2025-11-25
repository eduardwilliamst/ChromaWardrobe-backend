import { Router } from 'express';
import {
  suggestOutfit,
  getColorCompatibility
} from '../controllers/outfitController';
import {
  outfitSuggestionValidator,
  productIdValidator
} from '../middleware/validators';

const router = Router();

// POST /api/outfits/suggest - Get outfit suggestions for a product
router.post('/suggest', outfitSuggestionValidator, suggestOutfit);

// GET /api/outfits/color-compatibility/:id - Get color compatibility info
router.get('/color-compatibility/:id', productIdValidator, getColorCompatibility);

export default router;
