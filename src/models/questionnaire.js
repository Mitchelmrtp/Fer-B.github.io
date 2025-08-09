import { DataTypes } from 'sequelize';
import sequelize from '../config/dataBase.js';

const Questionnaire = sequelize.define('Questionnaire', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Permitir null para cuestionarios anónimos existentes
    comment: 'ID del usuario que completó el cuestionario'
  },
  responses: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'Almacena todas las respuestas del cuestionario en formato JSON'
  },
  completedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    comment: 'Fecha y hora en que se completó el cuestionario'
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Dirección IP desde donde se respondió'
  }
}, {
  tableName: 'questionnaires',
  timestamps: true,
  indexes: [
    {
      fields: ['completedAt']
    }
  ]
});

export default Questionnaire;
