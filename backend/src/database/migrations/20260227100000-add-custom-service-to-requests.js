'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('service_requests', 'custom_service_name', {
            type: Sequelize.STRING,
            allowNull: true,
        });
        await queryInterface.changeColumn('service_requests', 'service_id', {
            type: Sequelize.UUID,
            allowNull: true,
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('service_requests', 'custom_service_name');
        await queryInterface.changeColumn('service_requests', 'service_id', {
            type: Sequelize.UUID,
            allowNull: false,
        });
    }
};
