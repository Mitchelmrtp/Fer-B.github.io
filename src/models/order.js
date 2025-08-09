import { DataTypes } from 'sequelize';
import sequelize from '../config/dataBase.js';

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    cartId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'carts',
            key: 'id'
        }
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    paymentMethod: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            isIn: [['beso', 'baila', 'foto', 'abrazo', 'sonrisa']],
        }
    },
    paymentStatus: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'pending',
        validate: {
            isIn: [['pending', 'completed', 'failed']],
        }
    },
    status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'processing',
        validate: {
            isIn: [['processing', 'confirmed', 'shipped', 'delivered', 'cancelled']],
        }
    },
    orderDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    deliveryAddress: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
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
    tableName: 'orders'
});

export default Order;
