import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

// GET /user/:id - Obtener perfil de usuario
router.get('/:id', userController.getProfile);

// PUT /user/:id - Actualizar perfil de usuario
router.put('/:id', userController.updateProfile);

// GET /user/email/:email - Buscar usuario por email
router.get('/email/:email', userController.findByEmail);

// GET /user/document/:document - Buscar usuario por documento
router.get('/document/:document', userController.findByDocument);

// PUT /user/:id/status - Cambiar estado del usuario (admin)
router.put('/:id/status', userController.toggleUserStatus);

export default router;

