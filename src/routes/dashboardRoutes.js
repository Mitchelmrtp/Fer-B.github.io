import express from 'express';
import { getDashboardData, getUserOrders, getOrderDetails, getAllOrders, updateOrderStatus } from '../controllers/dashboardController.js';
import { validateUser } from '../middleware/auth.js';

const router = express.Router();

// Rutas para dashboard de cliente
router.get('/client/:userId', validateUser, getDashboardData);
router.get('/client/:userId/orders', validateUser, getUserOrders);
router.get('/order/:orderId', getOrderDetails); // Esta no necesita userId en params

// Rutas para dashboard de administrador (pueden usar query params o headers personalizados)
router.get('/admin/orders', getAllOrders); // Se puede agregar autenticación admin después
router.put('/admin/order/:orderId/status', updateOrderStatus); // Se puede agregar autenticación admin después

export default router;
