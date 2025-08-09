
import express from 'express';
import productController from '../controllers/productController.js';

const router = express.Router();

// GET /products - Obtener todos los productos con paginación
router.get('/', productController.getProducts);

// GET /products/search - Buscar productos
router.get('/search', productController.searchProducts);

// GET /products/category/:category - Obtener productos por categoría
router.get('/category/:category', productController.getProductsByCategory);

// GET /categories - Obtener categorías disponibles
router.get('/categories', productController.getCategories);

export default router;

