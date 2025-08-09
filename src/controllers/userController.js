import userService from '../services/userService.js';

class UserController {
    // GET /user/:id - Obtener perfil de usuario
    async getProfile(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de usuario requerido'
                });
            }

            const user = await userService.getUserProfile(parseInt(id));

            res.status(200).json({
                success: true,
                message: 'Perfil obtenido exitosamente',
                data: user
            });
        } catch (error) {
            console.error('Error en getProfile:', error);
            
            if (error.message.includes('Usuario no encontrado')) {
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

    // PUT /user/:id - Actualizar perfil de usuario
    async updateProfile(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de usuario requerido'
                });
            }

            // Remover campos que no se pueden actualizar directamente
            delete updateData.id;
            delete updateData.tipo;
            delete updateData.estado;
            delete updateData.createdAt;
            delete updateData.updatedAt;

            const user = await userService.updateUser(parseInt(id), updateData);

            res.status(200).json({
                success: true,
                message: 'Perfil actualizado exitosamente',
                data: user
            });
        } catch (error) {
            console.error('Error en updateProfile:', error);
            
            if (error.message.includes('Usuario no encontrado')) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

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

    // GET /user/email/:email - Buscar usuario por email
    async findByEmail(req, res) {
        try {
            const { email } = req.params;

            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: 'Email requerido'
                });
            }

            const user = await userService.findByEmail(email);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }

            // Retornar solo información básica (sin contraseña)
            const { contrasena, ...userWithoutPassword } = user.toJSON();

            res.status(200).json({
                success: true,
                message: 'Usuario encontrado',
                data: userWithoutPassword
            });
        } catch (error) {
            console.error('Error en findByEmail:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error interno del servidor'
            });
        }
    }

    // GET /user/document/:document - Buscar usuario por documento
    async findByDocument(req, res) {
        try {
            const { document } = req.params;

            if (!document) {
                return res.status(400).json({
                    success: false,
                    message: 'Número de documento requerido'
                });
            }

            const user = await userService.findByDocument(document);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Usuario encontrado',
                data: user
            });
        } catch (error) {
            console.error('Error en findByDocument:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error interno del servidor'
            });
        }
    }

    // PUT /user/:id/status - Cambiar estado del usuario (admin)
    async toggleUserStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!id || !status) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de usuario y estado son requeridos'
                });
            }

            const validStatuses = ['activo', 'inactivo', 'suspendido'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Estado no válido. Opciones: ' + validStatuses.join(', ')
                });
            }

            const user = await userService.toggleUserStatus(parseInt(id), status);

            res.status(200).json({
                success: true,
                message: 'Estado de usuario actualizado exitosamente',
                data: user
            });
        } catch (error) {
            console.error('Error en toggleUserStatus:', error);
            
            if (error.message.includes('Usuario no encontrado')) {
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

export default new UserController();

