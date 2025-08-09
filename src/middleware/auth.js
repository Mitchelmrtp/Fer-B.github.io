import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

// Middleware JWT (para uso futuro)
export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token de acceso requerido'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_jwt_secret_key');
        
        // Buscar el usuario en la base de datos
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Error en authenticateToken:', error);
        return res.status(403).json({
            success: false,
            message: 'Token inválido'
        });
    }
};

// Middleware simple para validar usuario por ID (sin JWT)
export const validateUser = async (req, res, next) => {
    try {
        const userId = req.params.userId || req.body.userId || req.query.userId;
        
        console.log('🔍 ValidateUser - Datos de la petición:');
        console.log('- req.params:', req.params);
        console.log('- req.body:', req.body);
        console.log('- req.query:', req.query);
        console.log('- userId extraído:', userId);
        
        if (!userId) {
            console.log('❌ Error: ID de usuario no encontrado');
            return res.status(400).json({
                success: false,
                message: 'ID de usuario requerido'
            });
        }

        // Buscar el usuario en la base de datos
        console.log('🔍 Buscando usuario con ID:', userId);
        const user = await User.findByPk(userId);
        
        if (!user) {
            console.log('❌ Usuario no encontrado en BD para ID:', userId);
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        console.log('✅ Usuario encontrado:', { id: user.id, nombres: user.nombres, estado: user.estado });

        if (user.estado !== 'activo') {
            console.log('❌ Usuario inactivo:', user.estado);
            return res.status(403).json({
                success: false,
                message: 'Usuario inactivo'
            });
        }

        req.user = user;
        console.log('✅ Usuario validado correctamente, continuando...');
        next();
    } catch (error) {
        console.error('❌ Error en validateUser:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
