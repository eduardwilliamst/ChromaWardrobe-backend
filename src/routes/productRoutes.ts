import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController';
import {
  createProductValidator,
  updateProductValidator,
  productIdValidator,
  productQueryValidator
} from '../middleware/validators';

const router = Router();

// GET /api/products - Get all products with filtering and pagination
router.get('/', productQueryValidator, getAllProducts);

// GET /api/products/:id - Get single product by ID
router.get('/:id', productIdValidator, getProductById);

// POST /api/products - Create new product (admin)
router.post('/', createProductValidator, createProduct);

// PUT /api/products/:id - Update product (admin)
router.put('/:id', updateProductValidator, updateProduct);

// DELETE /api/products/:id - Delete product (admin)
router.delete('/:id', productIdValidator, deleteProduct);

export default router;
