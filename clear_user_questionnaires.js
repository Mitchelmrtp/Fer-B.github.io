import sequelize from './src/config/dataBase.js';

async function clearUserQuestionnaires() {
  try {
    const userId = process.argv[2];
    
    if (!userId) {
      console.log('❌ Por favor proporciona un userId');
      console.log('Uso: node clear_user_questionnaires.js <userId>');
      process.exit(1);
    }
    
    console.log(`🗑️ Eliminando todos los cuestionarios del usuario ${userId}...`);
    
    const [result] = await sequelize.query(`
      DELETE FROM questionnaires 
      WHERE "userId" = :userId
    `, {
      replacements: { userId: parseInt(userId) }
    });
    
    console.log(`✅ Eliminados ${result.affectedRows || 'algunos'} cuestionarios del usuario ${userId}`);
    
    // Verificar el conteo después
    const [countResult] = await sequelize.query(`
      SELECT COUNT(*) as count
      FROM questionnaires 
      WHERE "userId" = :userId
    `, {
      replacements: { userId: parseInt(userId) }
    });
    
    console.log(`📊 Cuestionarios restantes para usuario ${userId}:`, countResult[0].count);
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    await sequelize.close();
    process.exit(1);
  }
}

clearUserQuestionnaires();
