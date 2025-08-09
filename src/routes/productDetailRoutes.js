import express from 'express';
import productController from '../controllers/productController.js';

const router = express.Router();

// GET /product/:id - Obtener producto por ID
router.get('/:id', productController.getProductById);

// GET /product/:id/related - Obtener productos relacionados
router.get('/:id/related', productController.getRelatedProducts);

// GET /product/:id/stock - Verificar stock de producto
router.get('/:id/stock', productController.checkStock);

export default router;
