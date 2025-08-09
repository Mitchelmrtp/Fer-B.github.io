import sequelize from './src/config/dataBase.js';

async function checkAndAddColumn() {
  try {
    console.log('🔍 Verificando estructura actual de la tabla questionnaires...');
    
    const [results] = await sequelize.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'questionnaires' 
      ORDER BY ordinal_position
    `);
    
    console.log('📋 Columnas actuales:');
    console.table(results);
    
    const hasUserIdColumn = results.some(col => col.column_name === 'userId');
    
    if (!hasUserIdColumn) {
      console.log('➕ Añadiendo columna userId...');
      await sequelize.query('ALTER TABLE questionnaires ADD COLUMN "userId" INTEGER');
      console.log('✅ Columna userId añadida exitosamente');
      
      // Verificar que se añadió correctamente
      const [newResults] = await sequelize.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'questionnaires' 
        ORDER BY ordinal_position
      `);
      console.log('📋 Columnas después de la modificación:');
      console.table(newResults);
    } else {
      console.log('✅ La columna userId ya existe');
    }
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    await sequelize.close();
    process.exit(1);
  }
}

checkAndAddColumn();
