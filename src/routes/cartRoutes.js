import express from 'express';
import cartController from '../controllers/cartController.js';

const router = express.Router();

// GET /cart/:userId - Obtener carrito activo del usuario
router.get('/:userId', cartController.getCart);

// POST /cart/add - Agregar producto al carrito
router.post('/add', cartController.addToCart);

// PUT /cart/item/:cartItemId - Actualizar cantidad de item en carrito
router.put('/item/:cartItemId', cartController.updateCartItem);

// DELETE /cart/item/:cartItemId - Remover item del carrito
router.delete('/item/:cartItemId', cartController.removeCartItem);

// DELETE /cart/clear/:userId - Limpiar carrito
router.delete('/clear/:userId', cartController.clearCart);

export default router;
