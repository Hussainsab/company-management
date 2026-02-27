'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Force service_id to be nullable
        await queryInterface.changeColumn('service_requests', 'service_id', {
            type: Sequelize.UUID,
            allowNull: true,
        });
    },

    down: async (queryInterface, Sequelize) => {
        // In theory, we'd go back to false, but project proposals REQUIRE it to be null
        await queryInterface.changeColumn('service_requests', 'service_id', {
            type: Sequelize.UUID,
            allowNull: false,
        });
    }
};
