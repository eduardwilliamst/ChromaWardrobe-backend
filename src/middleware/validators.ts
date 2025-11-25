import { body, param, query } from 'express-validator';

// Product validators
export const createProductValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),

  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),

  body('color')
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('Color must be a valid HEX code (e.g., #FF5733)'),

  body('category')
    .isIn(['top', 'bottom', 'dress'])
    .withMessage('Category must be one of: top, bottom, dress'),

  body('material')
    .trim()
    .notEmpty()
    .withMessage('Material is required'),

  body('season')
    .isIn(['spring', 'summer', 'fall', 'winter', 'all-season'])
    .withMessage('Season must be one of: spring, summer, fall, winter, all-season'),

  body('occasion')
    .isIn(['casual', 'formal', 'business', 'party', 'athletic'])
    .withMessage('Occasion must be one of: casual, formal, business, party, athletic'),

  body('image_url')
    .isURL()
    .withMessage('Image URL must be a valid URL')
];

export const updateProductValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid product ID'),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),

  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),

  body('color')
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('Color must be a valid HEX code'),

  body('category')
    .optional()
    .isIn(['top', 'bottom', 'dress'])
    .withMessage('Category must be one of: top, bottom, dress'),

  body('season')
    .optional()
    .isIn(['spring', 'summer', 'fall', 'winter', 'all-season'])
    .withMessage('Season must be one of: spring, summer, fall, winter, all-season'),

  body('occasion')
    .optional()
    .isIn(['casual', 'formal', 'business', 'party', 'athletic'])
    .withMessage('Occasion must be one of: casual, formal, business, party, athletic'),

  body('image_url')
    .optional()
    .isURL()
    .withMessage('Image URL must be a valid URL')
];

export const productIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid product ID')
];

// Outfit suggestion validators
export const outfitSuggestionValidator = [
  body('productId')
    .isMongoId()
    .withMessage('Invalid product ID')
];

// Pinterest search validators
export const pinterestSearchValidator = [
  body('query')
    .trim()
    .notEmpty()
    .withMessage('Search query is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Query must be between 2 and 200 characters'),

  body('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50')
];

export const pinterestBoardValidator = [
  body('boardId')
    .trim()
    .notEmpty()
    .withMessage('Board ID is required'),

  body('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50')
];

// Query validators for filtering
export const productQueryValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  query('category')
    .optional()
    .isIn(['top', 'bottom', 'dress'])
    .withMessage('Category must be one of: top, bottom, dress'),

  query('season')
    .optional()
    .isIn(['spring', 'summer', 'fall', 'winter', 'all-season'])
    .withMessage('Season must be one of: spring, summer, fall, winter, all-season'),

  query('occasion')
    .optional()
    .isIn(['casual', 'formal', 'business', 'party', 'athletic'])
    .withMessage('Occasion must be one of: casual, formal, business, party, athletic'),

  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('minPrice must be a positive number'),

  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('maxPrice must be a positive number')
];
