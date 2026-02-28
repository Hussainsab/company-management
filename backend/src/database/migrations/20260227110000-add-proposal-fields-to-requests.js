'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('service_requests', 'requested_project_name', {
            type: Sequelize.STRING,
            allowNull: true, // Nullable initially to avoid breaking existing data
        });
        await queryInterface.addColumn('service_requests', 'requested_employee_count', {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 1,
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('service_requests', 'requested_project_name');
        await queryInterface.removeColumn('service_requests', 'requested_employee_count');
    }
};
