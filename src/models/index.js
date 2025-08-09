import User from './user.js';
import Product from './product.js';
import Order from './order.js';
import OrderItem from './orderItem.js';
import Cart from './cart.js';
import CartItem from './cartItem.js';
import Questionnaire from './questionnaire.js';

// Relaciones Usuario - Carrito
User.hasMany(Cart, { foreignKey: 'userId', sourceKey: 'id', as: 'carts' });
Cart.belongsTo(User, { foreignKey: 'userId', targetKey: 'id', as: 'user' });

// Relaciones Carrito - Items del Carrito
Cart.hasMany(CartItem, { foreignKey: 'cartId', as: 'items' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId', as: 'cart' });

// Relaciones Producto - Items del Carrito
Product.hasMany(CartItem, { foreignKey: 'productId', as: 'cartItems' });
CartItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// Relaciones Usuario - Órdenes
User.hasMany(Order, { foreignKey: 'userId', sourceKey: 'id', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', targetKey: 'id', as: 'user' });

// Relaciones Carrito - Órdenes
Cart.hasMany(Order, { foreignKey: 'cartId', as: 'orders' });
Order.belongsTo(Cart, { foreignKey: 'cartId', as: 'cart' });

// Relaciones Orden - Items de la Orden
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

// Relaciones Producto - Items de la Orden
Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// Relaciones Usuario - Cuestionarios
User.hasMany(Questionnaire, { foreignKey: 'userId', as: 'questionnaires' });
Questionnaire.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export {
    User,
    Product,
    Order,
    OrderItem,
    Cart,
    CartItem,
    Questionnaire
};

