const { Sequelize } = require('sequelize');
const config = require('./src/config/config.js').development;

async function sync() {
    const sequelize = new Sequelize(config.database, config.username, config.password, {
        host: config.host,
        dialect: config.dialect
    });

    try {
        const migrations = [
            '20260227091000-add-project-id-to-service-requests.js',
            '20260227100000-add-custom-service-to-requests.js'
        ];

        for (const name of migrations) {
            const [exists] = await sequelize.query(`SELECT 1 FROM "SequelizeMeta" WHERE name = '${name}'`);
            if (exists.length === 0) {
                await sequelize.query(`INSERT INTO "SequelizeMeta" (name) VALUES ('${name}')`);
                console.log(`Marked ${name} as applied.`);
            } else {
                console.log(`${name} was already marked as applied.`);
            }
        }
    } catch (e) {
        console.error(e);
    } finally {
        await sequelize.close();
    }
}

sync();
