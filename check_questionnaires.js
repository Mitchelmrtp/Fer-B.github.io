import sequelize from './src/config/dataBase.js';

async function checkQuestionnaires() {
  try {
    console.log('🔍 Verificando todos los cuestionarios en la base de datos...\n');
    
    const [results] = await sequelize.query(`
      SELECT id, "userId", responses, "completedAt", "createdAt"
      FROM questionnaires 
      ORDER BY "createdAt" DESC
      LIMIT 10
    `);
    
    console.log('📋 Últimos 10 cuestionarios:');
    console.table(results.map(q => ({
      id: q.id,
      userId: q.userId,
      completedAt: q.completedAt,
      createdAt: q.createdAt,
      responsesCount: Object.keys(q.responses || {}).length
    })));
    
    console.log('\n🔢 Conteo por usuario:');
    const [countResults] = await sequelize.query(`
      SELECT "userId", COUNT(*) as count
      FROM questionnaires 
      WHERE "userId" IS NOT NULL
      GROUP BY "userId"
      ORDER BY "userId"
    `);
    
    console.table(countResults);
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    await sequelize.close();
    process.exit(1);
  }
}

checkQuestionnaires();
