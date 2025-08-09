import User from '../models/user.js';
import bcrypt from 'bcrypt';

class UserService {
    // Crear usuario sin encriptación (para desarrollo)
    async createUserSimple(userData) {
        try {
            // Verificar si el email ya existe
            const existingUserByEmail = await User.findOne({ 
                where: { correo: userData.correo } 
            });
            
            if (existingUserByEmail) {
                throw new Error('El correo electrónico ya está registrado');
            }

            // Verificar si el documento ya existe (si se proporciona)
            if (userData.nroDocumento) {
                const existingUserByDocument = await User.findOne({ 
                    where: { nroDocumento: userData.nroDocumento } 
                });
                
                if (existingUserByDocument) {
                    throw new Error('El número de documento ya está registrado');
                }
            }

            // Crear usuario sin encriptar contraseña
            const user = await User.create(userData);

            // Retornar usuario sin la contraseña
            const { contrasena, ...userWithoutPassword } = user.toJSON();
            return userWithoutPassword;
        } catch (error) {
            throw new Error(`Error al crear usuario: ${error.message}`);
        }
    }

    // Crear usuario (método original con encriptación)
    async createUser(userData) {
        try {
            // Verificar si el email ya existe
            const existingUserByEmail = await User.findOne({ 
                where: { correo: userData.correo } 
            });
            
            if (existingUserByEmail) {
                throw new Error('El correo electrónico ya está registrado');
            }

            // Verificar si el documento ya existe (si se proporciona)
            if (userData.nroDocumento) {
                const existingUserByDocument = await User.findOne({ 
                    where: { nroDocumento: userData.nroDocumento } 
                });
                
                if (existingUserByDocument) {
                    throw new Error('El número de documento ya está registrado');
                }
            }

            // Encriptar contraseña
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(userData.contrasena, saltRounds);

            const user = await User.create({
                ...userData,
                contrasena: hashedPassword
            });

            // Retornar usuario sin la contraseña
            const { contrasena, ...userWithoutPassword } = user.toJSON();
            return userWithoutPassword;
        } catch (error) {
            throw new Error(`Error al crear usuario: ${error.message}`);
        }
    }

    // Actualizar usuario
    async updateUser(id, data) {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            // Si se va a actualizar la contraseña, encriptarla
            if (data.contrasena) {
                const saltRounds = 10;
                data.contrasena = await bcrypt.hash(data.contrasena, saltRounds);
            }

            await user.update(data);
            
            // Retornar usuario sin la contraseña
            const { contrasena, ...userWithoutPassword } = user.toJSON();
            return userWithoutPassword;
        } catch (error) {
            throw new Error(`Error al actualizar usuario: ${error.message}`);
        }
    }

    // Buscar usuario por email
    async findByEmail(email) {
        try {
            return await User.findOne({ 
                where: { correo: email } 
            });
        } catch (error) {
            throw new Error(`Error al buscar usuario por email: ${error.message}`);
        }
    }

    // Buscar usuario por documento
    async findByDocument(document) {
        try {
            const user = await User.findOne({ 
                where: { nroDocumento: document } 
            });

            if (user) {
                const { contrasena, ...userWithoutPassword } = user.toJSON();
                return userWithoutPassword;
            }

            return null;
        } catch (error) {
            throw new Error(`Error al buscar usuario por documento: ${error.message}`);
        }
    }

    // Obtener usuario por ID
    async getUserById(id) {
        try {
            const user = await User.findByPk(id);
            
            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            const { contrasena, ...userWithoutPassword } = user.toJSON();
            return userWithoutPassword;
        } catch (error) {
            throw new Error(`Error al obtener usuario: ${error.message}`);
        }
    }

    // Validar credenciales de login
    async validateCredentials(email, password) {
        try {
            const user = await User.findOne({ 
                where: { correo: email } 
            });

            if (!user) {
                throw new Error('Credenciales inválidas');
            }

            if (user.estado !== 'activo') {
                throw new Error('Usuario inactivo');
            }

            const isPasswordValid = await bcrypt.compare(password, user.contrasena);
            
            if (!isPasswordValid) {
                throw new Error('Credenciales inválidas');
            }

            const { contrasena, ...userWithoutPassword } = user.toJSON();
            return userWithoutPassword;
        } catch (error) {
            throw new Error(`Error en validación: ${error.message}`);
        }
    }

    // Cambiar contraseña
    async changePassword(userId, currentPassword, newPassword) {
        try {
            const user = await User.findByPk(userId);
            
            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.contrasena);
            
            if (!isCurrentPasswordValid) {
                throw new Error('Contraseña actual incorrecta');
            }

            const saltRounds = 10;
            const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

            await user.update({ contrasena: hashedNewPassword });

            return { message: 'Contraseña actualizada exitosamente' };
        } catch (error) {
            throw new Error(`Error al cambiar contraseña: ${error.message}`);
        }
    }

    // Activar/desactivar usuario
    async toggleUserStatus(userId, status) {
        try {
            const validStatuses = ['activo', 'inactivo', 'suspendido'];
            
            if (!validStatuses.includes(status)) {
                throw new Error('Estado no válido');
            }

            const user = await User.findByPk(userId);
            
            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            await user.update({ estado: status });

            const { contrasena, ...userWithoutPassword } = user.toJSON();
            return userWithoutPassword;
        } catch (error) {
            throw new Error(`Error al cambiar estado del usuario: ${error.message}`);
        }
    }

    // Obtener perfil completo del usuario
    async getUserProfile(userId) {
        try {
            const user = await User.findByPk(userId, {
                attributes: { exclude: ['contrasena'] }
            });

            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            return user;
        } catch (error) {
            throw new Error(`Error al obtener perfil: ${error.message}`);
        }
    }
}

export default new UserService();

