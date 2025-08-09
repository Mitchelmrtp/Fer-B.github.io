import express from 'express';
import orderController from '../controllers/orderController.js';

const router = express.Router();

// POST /order/checkout - Procesar checkout
router.post('/checkout', orderController.checkout);

// GET /orders/:userId - Obtener órdenes de un usuario
router.get('s/:userId', orderController.getUserOrders);

// GET /order/:orderId - Obtener orden específica
router.get('/:orderId', orderController.getOrderById);

// PUT /order/:orderId/status - Actualizar estado de orden
router.put('/:orderId/status', orderController.updateOrderStatus);

// DELETE /order/:orderId/cancel - Cancelar orden
router.delete('/:orderId/cancel', orderController.cancelOrder);

export default router;
