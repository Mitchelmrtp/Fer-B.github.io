import userService from '../services/userService.js';

class AuthController {
    // POST /auth/register - Registrar usuario (sin encriptación)
    async register(req, res) {
        try {
            const { nombres, apellidos, correo, contrasena, nroDocumento, telefono } = req.body;

            // Validaciones básicas
            if (!nombres || !apellidos || !correo || !contrasena) {
                return res.status(400).json({
                    success: false,
                    message: 'Nombres, apellidos, correo y contraseña son requeridos'
                });
            }

            // Validar formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(correo)) {
                return res.status(400).json({
                    success: false,
                    message: 'Formato de correo electrónico inválido'
                });
            }

            // Verificar si el email ya existe
            const existingUser = await userService.findByEmail(correo);
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: 'El correo electrónico ya está registrado'
                });
            }

            // Crear usuario sin encriptación de contraseña
            const user = await userService.createUserSimple({
                nombres,
                apellidos,
                correo,
                contrasena, // Sin encriptar por ahora
                nroDocumento,
                telefono,
                tipo: 'cliente'
            });

            res.status(201).json({
                success: true,
                message: 'Usuario registrado exitosamente',
                data: { user }
            });
        } catch (error) {
            console.error('Error en register:', error);
            
            if (error.message.includes('ya está registrado')) {
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

    // POST /auth/login - Iniciar sesión (sin encriptación)
    async login(req, res) {
        try {
            const { correo, contrasena } = req.body;

            if (!correo || !contrasena) {
                return res.status(400).json({
                    success: false,
                    message: 'Correo y contraseña son requeridos'
                });
            }

            const user = await userService.findByEmail(correo);
            
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciales inválidas'
                });
            }

            if (user.estado !== 'activo') {
                return res.status(401).json({
                    success: false,
                    message: 'Usuario inactivo'
                });
            }

            // Comparación directa sin encriptación
            if (user.contrasena !== contrasena) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciales inválidas'
                });
            }

            // Remover contraseña de la respuesta
            const { contrasena: _, ...userWithoutPassword } = user.toJSON();

            res.status(200).json({
                success: true,
                message: 'Inicio de sesión exitoso',
                data: { user: userWithoutPassword }
            });
        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }

    // GET /auth/verify - Verificar sesión (simplificado)
    async verifyToken(req, res) {
        try {
            const { userId } = req.query;

            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de usuario requerido'
                });
            }

            const user = await userService.getUserById(parseInt(userId));

            res.status(200).json({
                success: true,
                message: 'Usuario verificado',
                data: { user }
            });
        } catch (error) {
            console.error('Error en verifyToken:', error);
            
            if (error.message.includes('Usuario no encontrado')) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
}

export default new AuthController();
