import Questionnaire from '../models/questionnaire.js';

// Enviar respuestas del cuestionario
export const submitQuestionnaire = async (req, res) => {
  try {
    const { responses, userId } = req.body; // Añadir userId
    const ipAddress = req.ip || req.connection.remoteAddress;

    if (!responses || typeof responses !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Las respuestas son requeridas y deben ser un objeto válido'
      });
    }

    const questionnaire = await Questionnaire.create({
      responses,
      userId: userId || null, // Permitir cuestionarios anónimos
      ipAddress,
      completedAt: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Cuestionario enviado exitosamente',
      data: {
        id: questionnaire.id,
        userId: questionnaire.userId,
        completedAt: questionnaire.completedAt
      }
    });

  } catch (error) {
    console.error('Error al enviar cuestionario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener todas las respuestas del cuestionario (solo admin)
export const getAllQuestionnaires = async (req, res) => {
  try {
    const questionnaires = await Questionnaire.findAll({
      order: [['completedAt', 'DESC']],
      attributes: ['id', 'responses', 'completedAt', 'ipAddress']
    });

    res.status(200).json({
      success: true,
      data: questionnaires,
      total: questionnaires.length
    });

  } catch (error) {
    console.error('Error al obtener cuestionarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener un cuestionario específico (solo admin)
export const getQuestionnaireById = async (req, res) => {
  try {
    const { id } = req.params;

    const questionnaire = await Questionnaire.findByPk(id);

    if (!questionnaire) {
      return res.status(404).json({
        success: false,
        message: 'Cuestionario no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: questionnaire
    });

  } catch (error) {
    console.error('Error al obtener cuestionario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Eliminar un cuestionario (solo admin)
export const deleteQuestionnaire = async (req, res) => {
  try {
    const { id } = req.params;

    const questionnaire = await Questionnaire.findByPk(id);

    if (!questionnaire) {
      return res.status(404).json({
        success: false,
        message: 'Cuestionario no encontrado'
      });
    }

    await questionnaire.destroy();

    res.status(200).json({
      success: true,
      message: 'Cuestionario eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar cuestionario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener el conteo de cuestionarios de un usuario
export const getQuestionnaireCount = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const count = await Questionnaire.count({
      where: {
        userId: userId
      }
    });
    
    res.json({
      success: true,
      data: {
        userId: parseInt(userId),
        questionnaireCount: count
      }
    });
  } catch (error) {
    console.error('Error obteniendo conteo de cuestionarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener todos los cuestionarios de un usuario
export const getUserQuestionnaires = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const questionnaires = await Questionnaire.findAll({
      where: {
        userId: userId
      },
      order: [['completedAt', 'DESC']]
    });
    
    res.json({
      success: true,
      data: questionnaires
    });
  } catch (error) {
    console.error('Error obteniendo cuestionarios del usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};
