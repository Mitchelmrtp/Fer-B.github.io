import { DataTypes } from 'sequelize';
import sequelize from '../config/dataBase.js';

const Cart = sequelize.define('Cart', {
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
    status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'active',
        validate: {
            isIn: [['active', 'completed', 'abandoned']],
        }
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
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
    tableName: 'carts',
    indexes: [
        {
            unique: true,
            fields: ['userId', 'status'],
            where: {
                status: 'active'
            },
            name: 'unique_active_cart_per_user'
        }
    ]
});

export default Cart;
