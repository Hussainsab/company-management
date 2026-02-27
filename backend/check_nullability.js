const { Sequelize } = require('sequelize');
const config = require('./src/config/config.js').development;

async function check() {
    const sequelize = new Sequelize(config.database, config.username, config.password, {
        host: config.host,
        dialect: config.dialect
    });

    try {
        const [results] = await sequelize.query(`
      SELECT column_name, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'service_requests'
    `);
        console.table(results);
    } catch (e) {
        console.error(e);
    } finally {
        await sequelize.close();
    }
}

check();
