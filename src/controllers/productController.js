import productService from '../services/productService.js';

class ProductController {
    // GET /products - Obtener todos los productos
    async getProducts(req, res) {
        try {
            const { page = 1, limit = 20 } = req.query;

            const result = await productService.getAllProducts(
                parseInt(page),
                parseInt(limit)
            );

            res.status(200).json({
                success: true,
                message: 'Productos obtenidos exitosamente',
                data: result
            });
        } catch (error) {
            console.error('Error en getProducts:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error interno del servidor'
            });
        }
    }

    // GET /product/:id - Obtener producto por ID
    async getProductById(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de producto requerido'
                });
            }

            const product = await productService.getProductById(parseInt(id));

            res.status(200).json({
                success: true,
                message: 'Producto obtenido exitosamente',
                data: product
            });
        } catch (error) {
            console.error('Error en getProductById:', error);
            
            if (error.message.includes('Producto no encontrado')) {
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

    // GET /products/search - Buscar productos
    async searchProducts(req, res) {
        try {
            const { q: searchTerm, page = 1, limit = 20 } = req.query;

            if (!searchTerm) {
                return res.status(400).json({
                    success: false,
                    message: 'Término de búsqueda requerido'
                });
            }

            const result = await productService.searchProducts(
                searchTerm,
                parseInt(page),
                parseInt(limit)
            );

            res.status(200).json({
                success: true,
                message: 'Búsqueda completada exitosamente',
                data: result
            });
        } catch (error) {
            console.error('Error en searchProducts:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error interno del servidor'
            });
        }
    }

    // GET /products/category/:category - Obtener productos por categoría
    async getProductsByCategory(req, res) {
        try {
            const { category } = req.params;
            const { page = 1, limit = 20 } = req.query;

            if (!category) {
                return res.status(400).json({
                    success: false,
                    message: 'Categoría requerida'
                });
            }

            const result = await productService.getProductsByCategory(
                category,
                parseInt(page),
                parseInt(limit)
            );

            res.status(200).json({
                success: true,
                message: 'Productos por categoría obtenidos exitosamente',
                data: result
            });
        } catch (error) {
            console.error('Error en getProductsByCategory:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error interno del servidor'
            });
        }
    }

    // GET /categories - Obtener categorías disponibles
    async getCategories(req, res) {
        try {
            const categories = await productService.getCategories();

            res.status(200).json({
                success: true,
                message: 'Categorías obtenidas exitosamente',
                data: categories
            });
        } catch (error) {
            console.error('Error en getCategories:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error interno del servidor'
            });
        }
    }

    // GET /product/:id/related - Obtener productos relacionados
    async getRelatedProducts(req, res) {
        try {
            const { id } = req.params;
            const { limit = 4 } = req.query;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de producto requerido'
                });
            }

            const relatedProducts = await productService.getRelatedProducts(
                parseInt(id),
                parseInt(limit)
            );

            res.status(200).json({
                success: true,
                message: 'Productos relacionados obtenidos exitosamente',
                data: relatedProducts
            });
        } catch (error) {
            console.error('Error en getRelatedProducts:', error);
            
            if (error.message.includes('Producto no encontrado')) {
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

    // GET /product/:id/stock - Verificar stock de producto
    async checkStock(req, res) {
        try {
            const { id } = req.params;
            const { quantity = 1 } = req.query;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de producto requerido'
                });
            }

            const stockInfo = await productService.checkStock(
                parseInt(id),
                parseInt(quantity)
            );

            res.status(200).json({
                success: true,
                message: 'Información de stock obtenida exitosamente',
                data: stockInfo
            });
        } catch (error) {
            console.error('Error en checkStock:', error);
            
            if (error.message.includes('Producto no encontrado')) {
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

export default new ProductController();
