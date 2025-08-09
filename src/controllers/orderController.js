import orderService from '../services/orderService.js';

class OrderController {
    // POST /order/checkout - Procesar checkout
    async checkout(req, res) {
        try {
            const { userId, paymentMethod, deliveryAddress, notes } = req.body;

            if (!userId || !paymentMethod) {
                return res.status(400).json({
                    success: false,
                    message: 'UserId y método de pago son requeridos'
                });
            }

            const validPaymentMethods = ['beso', 'baila', 'foto', 'abrazo', 'sonrisa'];
            if (!validPaymentMethods.includes(paymentMethod)) {
                return res.status(400).json({
                    success: false,
                    message: 'Método de pago no válido. Opciones: ' + validPaymentMethods.join(', ')
                });
            }

            const order = await orderService.processCheckout(parseInt(userId), {
                paymentMethod,
                deliveryAddress,
                notes
            });

            res.status(201).json({
                success: true,
                message: 'Orden creada exitosamente',
                data: order
            });
        } catch (error) {
            console.error('Error en checkout:', error);
            
            if (error.message.includes('carrito activo')) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            if (error.message.includes('carrito está vacío')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            if (error.message.includes('Stock insuficiente')) {
                return res.status(409).json({
                    success: false,
                    message: error.message
                });
            }

            res.status(500).json({
                success: false,
                message: error.message || 'Error interno del servidor'
            });
        }
    }

    // GET /orders/:userId - Obtener órdenes del usuario
    async getUserOrders(req, res) {
        try {
            const { userId } = req.params;
            const { page = 1, limit = 10 } = req.query;

            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de usuario requerido'
                });
            }

            const result = await orderService.getUserOrders(
                parseInt(userId),
                parseInt(page),
                parseInt(limit)
            );

            res.status(200).json({
                success: true,
                message: 'Órdenes obtenidas exitosamente',
                data: result
            });
        } catch (error) {
            console.error('Error en getUserOrders:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error interno del servidor'
            });
        }
    }

    // GET /order/:orderId - Obtener orden específica
    async getOrderById(req, res) {
        try {
            const { orderId } = req.params;

            if (!orderId) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de orden requerido'
                });
            }

            const order = await orderService.getOrderById(parseInt(orderId));

            res.status(200).json({
                success: true,
                message: 'Orden obtenida exitosamente',
                data: order
            });
        } catch (error) {
            console.error('Error en getOrderById:', error);
            
            if (error.message.includes('Orden no encontrada')) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            res.status(500).json({
                success: false,
                message: error.message || 'Error interno del servidor'
            });
        }
    }

    // PUT /order/:orderId/status - Actualizar estado de orden
    async updateOrderStatus(req, res) {
        try {
            const { orderId } = req.params;
            const { status } = req.body;

            if (!orderId || !status) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de orden y estado son requeridos'
                });
            }

            const validStatuses = ['processing', 'confirmed', 'shipped', 'delivered', 'cancelled'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Estado no válido. Opciones: ' + validStatuses.join(', ')
                });
            }

            const order = await orderService.updateOrderStatus(parseInt(orderId), status);

            res.status(200).json({
                success: true,
                message: 'Estado de orden actualizado exitosamente',
                data: order
            });
        } catch (error) {
            console.error('Error en updateOrderStatus:', error);
            
            if (error.message.includes('Orden no encontrada')) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            res.status(500).json({
                success: false,
                message: error.message || 'Error interno del servidor'
            });
        }
    }

    // DELETE /order/:orderId/cancel - Cancelar orden
    async cancelOrder(req, res) {
        try {
            const { orderId } = req.params;
            const { userId } = req.body;

            if (!orderId || !userId) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de orden y usuario son requeridos'
                });
            }

            const order = await orderService.cancelOrder(parseInt(orderId), parseInt(userId));

            res.status(200).json({
                success: true,
                message: 'Orden cancelada exitosamente',
                data: order
            });
        } catch (error) {
            console.error('Error en cancelOrder:', error);
            
            if (error.message.includes('Orden no encontrada')) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            if (error.message.includes('cancelar')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            res.status(500).json({
                success: false,
                message: error.message || 'Error interno del servidor'
            });
        }
    }

    // GET /orders/stats/:userId? - Obtener estadísticas de órdenes
    async getOrderStats(req, res) {
        try {
            const { userId } = req.params;

            const stats = await orderService.getOrderStats(userId ? parseInt(userId) : null);

            res.status(200).json({
                success: true,
                message: 'Estadísticas obtenidas exitosamente',
                data: stats
            });
        } catch (error) {
            console.error('Error en getOrderStats:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error interno del servidor'
            });
        }
    }
}

export default new OrderController();
