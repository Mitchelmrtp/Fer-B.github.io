import { DataTypes } from 'sequelize';
import sequelize from '../config/dataBase.js';

const OrderItem = sequelize.define('OrderItem', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    orderId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'orders',
            key: 'id'
        }
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'products',
            key: 'id'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    },
    unitPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    // Snapshot de los datos del producto al momento de la compra
    productSnapshot: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Snapshot of product data at time of purchase'
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    }
}, {
    timestamps: true,
    tableName: 'order_items'
});

export default OrderItem;
