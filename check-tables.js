const { sequelize } = require('./models');

async function checkTables() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a DB exitosa');

    const tables = await sequelize.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `);
    console.log('Tablas en la base de datos:', tables[0]);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkTables();