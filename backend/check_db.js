const { Sequelize } = require('sequelize');
const config = require('./src/config/config.js').development;

async function check() {
    const sequelize = new Sequelize(config.database, config.username, config.password, {
        host: config.host,
        dialect: config.dialect
    });

    try {
        const [results] = await sequelize.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'service_requests'");
        console.log('Columns in service_requests:', results.map(r => r.column_name));

        const [meta] = await sequelize.query("SELECT name FROM \"SequelizeMeta\"");
        console.log('Applied migrations:', meta.map(m => m.name));
    } catch (e) {
        console.error(e);
    } finally {
        await sequelize.close();
    }
}

check();
