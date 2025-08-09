import { Order, OrderItem, Cart, CartItem, Product, User } from '../models/index.js';
import sequelize from '../config/dataBase.js';
import cartService from './cartService.js';

class OrderService {
    // Procesar checkout del carrito
    async processCheckout(userId, checkoutData) {
        const transaction = await sequelize.transaction();
        
        try {
            const { paymentMethod, deliveryAddress, notes } = checkoutData;

            // Validar método de pago
            const validPaymentMethods = ['beso', 'baila', 'foto', 'abrazo', 'sonrisa'];
            if (!validPaymentMethods.includes(paymentMethod)) {
                throw new Error('Método de pago no válido');
            }

            // Obtener carrito activo del usuario
            const cart = await Cart.findOne({
                where: { 
                    userId,
                    status: 'active'
                },
                include: [
                    {
                        model: CartItem,
                        as: 'items',
                        include: [
                            {
                                model: Product,
                                as: 'product'
                            }
                        ]
                    }
                ]
            });

            if (!cart) {
                throw new Error('No hay carrito activo para el usuario');
            }

            if (!cart.items || cart.items.length === 0) {
                throw new Error('El carrito está vacío');
            }

            // Verificar stock disponible para todos los productos
            for (const item of cart.items) {
                if (item.product.stock < item.quantity) {
                    throw new Error(`Stock insuficiente para ${item.product.title}. Disponible: ${item.product.stock}`);
                }
            }

            // Crear la orden
            const order = await Order.create({
                userId,
                cartId: cart.id,
                total: cart.total,
                paymentMethod,
                deliveryAddress,
                notes,
                paymentStatus: 'completed', // Pago no monetario siempre completado
                status: 'processing'
            }, { transaction });

            // Copiar items del carrito a la orden
            for (const cartItem of cart.items) {
                await OrderItem.create({
                    orderId: order.id,
                    productId: cartItem.productId,
                    quantity: cartItem.quantity,
                    unitPrice: cartItem.unitPrice,
                    totalPrice: cartItem.totalPrice,
                    productSnapshot: {
                        title: cartItem.product.title,
                        description: cartItem.product.description,
                        image: cartItem.product.image,
                        category: cartItem.product.category,
                        surprise: cartItem.product.surprise
                    }
                }, { transaction });

                // Actualizar stock del producto
                await Product.update(
                    { 
                        stock: sequelize.literal(`stock - ${cartItem.quantity}`)
                    },
                    { 
                        where: { id: cartItem.productId },
                        transaction
                    }
                );
            }

            // Marcar carrito como completado
            await cartService.completeCart(cart.id);

            await transaction.commit();

            // Retornar orden completa
            return await this.getOrderById(order.id);
        } catch (error) {
            await transaction.rollback();
            throw new Error(`Error en checkout: ${error.message}`);
        }
    }

    // Obtener orden por ID
    async getOrderById(orderId) {
        try {
            const order = await Order.findByPk(orderId, {
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'nombres', 'apellidos', 'correo']
                    },
                    {
                        model: OrderItem,
                        as: 'items',
                        include: [
                            {
                                model: Product,
                                as: 'product'
                            }
                        ]
                    }
                ]
            });

            if (!order) {
                throw new Error('Orden no encontrada');
            }

            return order;
        } catch (error) {
            throw new Error(`Error al obtener orden: ${error.message}`);
        }
    }

    // Obtener órdenes de un usuario
    async getUserOrders(userId, page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;

            const { count, rows } = await Order.findAndCountAll({
                where: { userId },
                include: [
                    {
                        model: OrderItem,
                        as: 'items',
                        include: [
                            {
                                model: Product,
                                as: 'product'
                            }
                        ]
                    }
                ],
                order: [['createdAt', 'DESC']],
                limit,
                offset
            });

            return {
                orders: rows,
                totalOrders: count,
                currentPage: page,
                totalPages: Math.ceil(count / limit),
                hasNextPage: page < Math.ceil(count / limit),
                hasPreviousPage: page > 1
            };
        } catch (error) {
            throw new Error(`Error al obtener órdenes del usuario: ${error.message}`);
        }
    }

    // Actualizar estado de orden
    async updateOrderStatus(orderId, status) {
        try {
            const validStatuses = ['processing', 'confirmed', 'shipped', 'delivered', 'cancelled'];
            if (!validStatuses.includes(status)) {
                throw new Error('Estado no válido');
            }

            const order = await Order.findByPk(orderId);
            if (!order) {
                throw new Error('Orden no encontrada');
            }

            order.status = status;
            await order.save();

            return await this.getOrderById(orderId);
        } catch (error) {
            throw new Error(`Error al actualizar estado de orden: ${error.message}`);
        }
    }

    // Cancelar orden
    async cancelOrder(orderId, userId) {
        const transaction = await sequelize.transaction();
        
        try {
            const order = await Order.findOne({
                where: { 
                    id: orderId,
                    userId 
                },
                include: [
                    {
                        model: OrderItem,
                        as: 'items'
                    }
                ]
            });

            if (!order) {
                throw new Error('Orden no encontrada o no pertenece al usuario');
            }

            if (order.status === 'cancelled') {
                throw new Error('La orden ya está cancelada');
            }

            if (['shipped', 'delivered'].includes(order.status)) {
                throw new Error('No se puede cancelar una orden que ya fue enviada o entregada');
            }

            // Restaurar stock de productos
            for (const item of order.items) {
                await Product.update(
                    { 
                        stock: sequelize.literal(`stock + ${item.quantity}`)
                    },
                    { 
                        where: { id: item.productId },
                        transaction
                    }
                );
            }

            // Actualizar estado de la orden
            order.status = 'cancelled';
            await order.save({ transaction });

            await transaction.commit();
            return await this.getOrderById(orderId);
        } catch (error) {
            await transaction.rollback();
            throw new Error(`Error al cancelar orden: ${error.message}`);
        }
    }

    // Obtener estadísticas de órdenes
    async getOrderStats(userId = null) {
        try {
            const whereClause = userId ? { userId } : {};

            const stats = await Order.findAll({
                where: whereClause,
                attributes: [
                    'status',
                    [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
                    [sequelize.fn('SUM', sequelize.col('total')), 'totalAmount']
                ],
                group: ['status']
            });

            return stats;
        } catch (error) {
            throw new Error(`Error al obtener estadísticas: ${error.message}`);
        }
    }
}

export default new OrderService();
