import express from 'express';
import orderController from '../controllers/orderController.js';

const router = express.Router();

// GET /orders/:userId - Obtener órdenes del usuario
router.get('/:userId', orderController.getUserOrders);

// GET /orders/stats/:userId? - Obtener estadísticas de órdenes
router.get('/stats/:userId?', orderController.getOrderStats);

export default router;
