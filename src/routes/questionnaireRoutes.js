import express from 'express';
import { validateUser } from '../middleware/validateUser.js';
import { 
  submitQuestionnaire, 
  getAllQuestionnaires, 
  getQuestionnaireById, 
  deleteQuestionnaire,
  getQuestionnaireCount,
  getUserQuestionnaires
} from '../controllers/questionnaireController.js';

const router = express.Router();

// Middleware para verificar que el usuario es admin
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.tipo !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requieren permisos de administrador.'
    });
  }
  next();
};

// Rutas públicas
router.post('/submit', submitQuestionnaire);

// Rutas para conteo de cuestionarios por usuario
router.get('/user/:userId/count', getQuestionnaireCount);
router.get('/user/:userId', getUserQuestionnaires);

// Rutas protegidas para admin
router.get('/admin/all', validateUser, requireAdmin, getAllQuestionnaires);
router.get('/admin/:id', validateUser, requireAdmin, getQuestionnaireById);
router.delete('/admin/:id', validateUser, requireAdmin, deleteQuestionnaire);

export default router;
