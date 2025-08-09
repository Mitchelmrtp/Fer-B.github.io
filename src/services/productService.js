import Product from "../models/product.js";
import { Op } from 'sequelize';

class ProductService {
    // Obtener todos los productos
    async getAllProducts(page = 1, limit = 20) {
        try {
            const offset = (page - 1) * limit;

            const { count, rows } = await Product.findAndCountAll({
                order: [['createdAt', 'DESC']],
                limit,
                offset
            });

            return {
                products: rows,
                totalProducts: count,
                currentPage: page,
                totalPages: Math.ceil(count / limit),
                hasNextPage: page < Math.ceil(count / limit),
                hasPreviousPage: page > 1
            };
        } catch (error) {
            throw new Error(`Error al obtener productos: ${error.message}`);
        }
    }

    // Obtener producto por ID
    async getProductById(id) {
        try {
            const product = await Product.findOne({
                where: { id }
            });

            if (!product) {
                throw new Error('Producto no encontrado');
            }

            return product;
        } catch (error) {
            throw new Error(`Error al obtener producto: ${error.message}`);
        }
    }

    // Buscar productos por término de búsqueda
    async searchProducts(searchTerm, page = 1, limit = 20) {
        try {
            const offset = (page - 1) * limit;

            const { count, rows } = await Product.findAndCountAll({
                where: {
                    [Op.or]: [
                        { title: { [Op.iLike]: `%${searchTerm}%` } },
                        { description: { [Op.iLike]: `%${searchTerm}%` } },
                        { category: { [Op.iLike]: `%${searchTerm}%` } },
                        { surprise: { [Op.iLike]: `%${searchTerm}%` } }
                    ]
                },
                order: [['createdAt', 'DESC']],
                limit,
                offset
            });

            return {
                products: rows,
                totalProducts: count,
                currentPage: page,
                totalPages: Math.ceil(count / limit),
                searchTerm
            };
        } catch (error) {
            throw new Error(`Error en búsqueda de productos: ${error.message}`);
        }
    }

    // Obtener productos por categoría
    async getProductsByCategory(category, page = 1, limit = 20) {
        try {
            const offset = (page - 1) * limit;

            const { count, rows } = await Product.findAndCountAll({
                where: { category },
                order: [['createdAt', 'DESC']],
                limit,
                offset
            });

            return {
                products: rows,
                totalProducts: count,
                currentPage: page,
                totalPages: Math.ceil(count / limit),
                category
            };
        } catch (error) {
            throw new Error(`Error al obtener productos por categoría: ${error.message}`);
        }
    }

    // Obtener categorías disponibles
    async getCategories() {
        try {
            const categories = await Product.findAll({
                attributes: ['category'],
                group: ['category'],
                order: [['category', 'ASC']]
            });

            return categories.map(item => item.category);
        } catch (error) {
            throw new Error(`Error al obtener categorías: ${error.message}`);
        }
    }

    // Verificar disponibilidad del producto
    async checkAvailability(productId) {
        try {
            const product = await Product.findByPk(productId);
            
            if (!product) {
                throw new Error('Producto no encontrado');
            }

            return {
                available: true,
                product: product
            };
        } catch (error) {
            throw new Error(`Error al verificar disponibilidad: ${error.message}`);
        }
    }

    // Obtener productos relacionados por categoría
    async getRelatedProducts(productId, limit = 4) {
        try {
            const product = await Product.findByPk(productId);
            
            if (!product) {
                throw new Error('Producto no encontrado');
            }

            const relatedProducts = await Product.findAll({
                where: {
                    category: product.category,
                    id: { [Op.ne]: productId } // Excluir el producto actual
                },
                limit,
                order: [['createdAt', 'DESC']]
            });

            return relatedProducts;
        } catch (error) {
            throw new Error(`Error al obtener productos relacionados: ${error.message}`);
        }
    }
}

export default new ProductService();

