import { Cart, CartItem, Product, User } from '../models/index.js';
import sequelize from '../config/dataBase.js';

class CartService {
    // Obtener o crear carrito activo para un usuario
    async getOrCreateActiveCart(userId) {
        try {
            let cart = await Cart.findOne({
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
                cart = await Cart.create({
                    userId,
                    status: 'active',
                    total: 0.00
                });
                
                // Recargar con items incluidos
                cart = await Cart.findByPk(cart.id, {
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
            }

            return cart;
        } catch (error) {
            throw new Error(`Error al obtener/crear carrito: ${error.message}`);
        }
    }

    // Agregar producto al carrito
    async addProductToCart(userId, productId, quantity = 1) {
        const transaction = await sequelize.transaction();
        
        try {
            // Verificar que el producto existe
            const product = await Product.findByPk(productId);
            if (!product) {
                throw new Error('Producto no encontrado');
            }

            // Obtener o crear carrito activo
            const cart = await this.getOrCreateActiveCart(userId);

            // Verificar si el producto ya está en el carrito
            let cartItem = await CartItem.findOne({
                where: {
                    cartId: cart.id,
                    productId
                }
            });

            const unitPrice = parseFloat(product.price);

            if (cartItem) {
                // Actualizar cantidad si ya existe
                const newQuantity = cartItem.quantity + quantity;
                
                if (product.stock < newQuantity) {
                    throw new Error(`Stock insuficiente. Disponible: ${product.stock}`);
                }

                cartItem.quantity = newQuantity;
                cartItem.totalPrice = unitPrice * newQuantity;
                await cartItem.save({ transaction });
            } else {
                // Crear nuevo item en el carrito
                cartItem = await CartItem.create({
                    cartId: cart.id,
                    productId,
                    quantity,
                    unitPrice,
                    totalPrice: unitPrice * quantity
                }, { transaction });
            }

            // Actualizar total del carrito
            await this.updateCartTotal(cart.id, transaction);

            await transaction.commit();

            // Retornar carrito actualizado
            return await this.getCartWithItems(cart.id);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    // Actualizar cantidad de un item en el carrito
    async updateCartItemQuantity(cartItemId, quantity) {
        const transaction = await sequelize.transaction();
        
        try {
            const cartItem = await CartItem.findByPk(cartItemId, {
                include: [
                    {
                        model: Product,
                        as: 'product'
                    }
                ]
            });

            if (!cartItem) {
                throw new Error('Item del carrito no encontrado');
            }

            if (cartItem.product.stock < quantity) {
                throw new Error(`Stock insuficiente. Disponible: ${cartItem.product.stock}`);
            }

            cartItem.quantity = quantity;
            cartItem.totalPrice = cartItem.unitPrice * quantity;
            await cartItem.save({ transaction });

            // Actualizar total del carrito
            await this.updateCartTotal(cartItem.cartId, transaction);

            await transaction.commit();
            return await this.getCartWithItems(cartItem.cartId);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    // Remover item del carrito
    async removeCartItem(cartItemId) {
        const transaction = await sequelize.transaction();
        
        try {
            const cartItem = await CartItem.findByPk(cartItemId);
            if (!cartItem) {
                throw new Error('Item del carrito no encontrado');
            }

            const cartId = cartItem.cartId;
            await cartItem.destroy({ transaction });

            // Actualizar total del carrito
            await this.updateCartTotal(cartId, transaction);

            await transaction.commit();
            return await this.getCartWithItems(cartId);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    // Limpiar carrito
    async clearCart(userId) {
        const transaction = await sequelize.transaction();
        
        try {
            const cart = await Cart.findOne({
                where: { 
                    userId,
                    status: 'active'
                }
            });

            if (!cart) {
                throw new Error('Carrito activo no encontrado');
            }

            await CartItem.destroy({
                where: { cartId: cart.id }
            }, { transaction });

            cart.total = 0.00;
            await cart.save({ transaction });

            await transaction.commit();
            return cart;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    // Marcar carrito como completado
    async completeCart(cartId) {
        const cart = await Cart.findByPk(cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        cart.status = 'completed';
        await cart.save();
        return cart;
    }

    // Obtener carrito con items
    async getCartWithItems(cartId) {
        return await Cart.findByPk(cartId, {
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
    }

    // Actualizar total del carrito
    async updateCartTotal(cartId, transaction = null) {
        const cartItems = await CartItem.findAll({
            where: { cartId }
        });

        const total = cartItems.reduce((sum, item) => {
            return sum + parseFloat(item.totalPrice);
        }, 0);

        await Cart.update(
            { total },
            { 
                where: { id: cartId },
                transaction
            }
        );
    }

    // Obtener carrito por usuario
    async getCartByUserId(userId) {
        return await this.getOrCreateActiveCart(userId);
    }
}

export default new CartService();
