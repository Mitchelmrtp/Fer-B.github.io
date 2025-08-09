import cartService from '../services/cartService.js';

class CartController {
    // GET /cart/:userId - Obtener carrito activo del usuario
    async getCart(req, res) {
        try {
            const { userId } = req.params;

            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de usuario requerido'
                });
            }

            const cart = await cartService.getCartByUserId(parseInt(userId));

            res.status(200).json({
                success: true,
                message: 'Carrito obtenido exitosamente',
                data: cart
            });
        } catch (error) {
            console.error('Error en getCart:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error interno del servidor'
            });
        }
    }

    // POST /cart/add - Agregar producto al carrito
    async addToCart(req, res) {
        try {
            const { userId, productId, quantity = 1 } = req.body;

            if (!userId || !productId) {
                return res.status(400).json({
                    success: false,
                    message: 'UserId y ProductId son requeridos'
                });
            }

            if (quantity <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'La cantidad debe ser mayor a 0'
                });
            }

            const cart = await cartService.addProductToCart(
                parseInt(userId), 
                parseInt(productId), 
                parseInt(quantity)
            );

            res.status(200).json({
                success: true,
                message: 'Producto agregado al carrito exitosamente',
                data: cart
            });
        } catch (error) {
            console.error('Error en addToCart:', error);
            
            // Manejar errores específicos
            if (error.message.includes('Producto no encontrado')) {
                return res.status(404).json({
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

    // PUT /cart/item/:cartItemId - Actualizar cantidad de item en carrito
    async updateCartItem(req, res) {
        try {
            const { cartItemId } = req.params;
            const { quantity } = req.body;

            if (!cartItemId) {
                return res.status(400).json({
                    success: false,
                    message: 'ID del item del carrito requerido'
                });
            }

            if (!quantity || quantity <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Cantidad válida requerida'
                });
            }

            const cart = await cartService.updateCartItemQuantity(
                parseInt(cartItemId), 
                parseInt(quantity)
            );

            res.status(200).json({
                success: true,
                message: 'Item del carrito actualizado exitosamente',
                data: cart
            });
        } catch (error) {
            console.error('Error en updateCartItem:', error);
            
            if (error.message.includes('Item del carrito no encontrado')) {
                return res.status(404).json({
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

    // DELETE /cart/item/:cartItemId - Remover item del carrito
    async removeCartItem(req, res) {
        try {
            const { cartItemId } = req.params;

            if (!cartItemId) {
                return res.status(400).json({
                    success: false,
                    message: 'ID del item del carrito requerido'
                });
            }

            const cart = await cartService.removeCartItem(parseInt(cartItemId));

            res.status(200).json({
                success: true,
                message: 'Item removido del carrito exitosamente',
                data: cart
            });
        } catch (error) {
            console.error('Error en removeCartItem:', error);
            
            if (error.message.includes('Item del carrito no encontrado')) {
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

    // DELETE /cart/clear/:userId - Limpiar carrito
    async clearCart(req, res) {
        try {
            const { userId } = req.params;

            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de usuario requerido'
                });
            }

            const cart = await cartService.clearCart(parseInt(userId));

            res.status(200).json({
                success: true,
                message: 'Carrito limpiado exitosamente',
                data: cart
            });
        } catch (error) {
            console.error('Error en clearCart:', error);
            
            if (error.message.includes('Carrito activo no encontrado')) {
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
}

export default new CartController();
