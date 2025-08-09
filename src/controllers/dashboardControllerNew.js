import { Order, OrderItem, Product, User, Cart } from '../models/index.js';
import { Op } from 'sequelize';

// Dashboard para cliente
export const getDashboardData = async (req, res) => {
    try {
        console.log('🎯 getDashboardData - Iniciando...');
        console.log('🎯 req.params:', req.params);
        console.log('🎯 req.user:', req.user ? { id: req.user.id, tipo: req.user.tipo } : 'NO USER');
        
        const { userId } = req.params;
        
        // Verificar que el usuario solo pueda ver sus propios datos o sea admin
        // 🔧 FIX: Convertir ambos valores a string para comparar correctamente
        if (req.user.id.toString() !== userId.toString() && req.user.tipo !== 'admin') {
            console.log('❌ Acceso denegado: usuario no autorizado');
            console.log(`❌ Comparación: req.user.id(${req.user.id}) !== userId(${userId})`);
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para ver esta información'
            });
        }

        console.log('✅ Usuario autorizado, obteniendo estadísticas...');

        // Estadísticas del cliente
        const totalOrders = await Order.count({
            where: { userId }
        });

        const orders = await Order.findAll({
            where: { userId },
            include: [
                {
                    model: OrderItem,
                    include: [Product]
                }
            ],
            order: [['createdAt', 'DESC']],
            limit: 5
        });

        const totalSpent = await Order.sum('total', {
            where: { 
                userId,
                paymentStatus: 'completed'
            }
        }) || 0;

        const pendingOrders = await Order.count({
            where: { 
                userId,
                status: 'processing'
            }
        });

        res.json({
            success: true,
            data: {
                user: {
                    id: req.user.id,
                    nombres: req.user.nombres,
                    apellidos: req.user.apellidos,
                    correo: req.user.correo
                },
                statistics: {
                    totalOrders,
                    totalSpent,
                    pendingOrders
                },
                recentOrders: orders
            }
        });

    } catch (error) {
        console.error('Error en getDashboardData:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Obtener pedidos del usuario con paginación
export const getUserOrders = async (req, res) => {
    try {
        console.log('🎯 getUserOrders - Iniciando...');
        const { userId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        // Verificar autorización
        if (req.user.id.toString() !== userId.toString() && req.user.tipo !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para ver esta información'
            });
        }

        const offset = (page - 1) * limit;

        const { count, rows: orders } = await Order.findAndCountAll({
            where: { userId },
            include: [
                {
                    model: OrderItem,
                    include: [Product]
                }
            ],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({
            success: true,
            data: {
                orders,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: count,
                    totalPages: Math.ceil(count / limit)
                }
            }
        });

    } catch (error) {
        console.error('Error en getUserOrders:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Obtener detalles específicos de un pedido
export const getOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findByPk(orderId, {
            include: [
                {
                    model: OrderItem,
                    include: [Product]
                },
                {
                    model: User,
                    attributes: ['id', 'nombres', 'apellidos', 'correo']
                }
            ]
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Pedido no encontrado'
            });
        }

        res.json({
            success: true,
            data: order
        });

    } catch (error) {
        console.error('Error en getOrderDetails:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Dashboard para administrador - Obtener todos los pedidos
export const getAllOrders = async (req, res) => {
    try {
        const { page = 1, limit = 20, status, startDate, endDate } = req.query;
        const offset = (page - 1) * limit;

        // Construir filtros
        const whereClause = {};
        
        if (status) {
            whereClause.status = status;
        }

        if (startDate && endDate) {
            whereClause.createdAt = {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            };
        }

        const { count, rows: orders } = await Order.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: OrderItem,
                    include: [Product]
                },
                {
                    model: User,
                    attributes: ['id', 'nombres', 'apellidos', 'correo']
                }
            ],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        // Estadísticas para el admin
        const statistics = {
            totalOrders: await Order.count(),
            totalRevenue: await Order.sum('total', {
                where: { paymentStatus: 'completed' }
            }) || 0,
            pendingOrders: await Order.count({
                where: { status: 'processing' }
            }),
            completedOrders: await Order.count({
                where: { status: 'completed' }
            })
        };

        res.json({
            success: true,
            data: {
                orders,
                statistics,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: count,
                    totalPages: Math.ceil(count / limit)
                }
            }
        });

    } catch (error) {
        console.error('Error en getAllOrders:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Actualizar estado de pedido (solo admin)
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status, paymentStatus } = req.body;

        const order = await Order.findByPk(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Pedido no encontrado'
            });
        }

        // Actualizar campos si se proporcionan
        if (status) order.status = status;
        if (paymentStatus) order.paymentStatus = paymentStatus;

        await order.save();

        res.json({
            success: true,
            message: 'Estado del pedido actualizado correctamente',
            data: order
        });

    } catch (error) {
        console.error('Error en updateOrderStatus:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
