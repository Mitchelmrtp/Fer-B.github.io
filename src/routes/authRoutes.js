import express from 'express';
import authController from '../controllers/authController.js';

const router = express.Router();

// POST /auth/register - Registrar usuario
router.post('/register', authController.register);

// POST /auth/login - Iniciar sesión
router.post('/login', authController.login);

// GET /auth/verify - Verificar sesión (simplificado)
router.get('/verify', authController.verifyToken);

export default router;
