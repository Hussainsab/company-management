'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable('profiles', {
    id:{
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal("gen_random_uuid()"),
      allowNull: false,
      primaryKey: true
    },
    user_id:{
      type: Sequelize.UUID,
      allowNull: false,
      references:{
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    first_name:{
      type: Sequelize.STRING
    },
    last_name:{
      type: Sequelize.STRING
    },
    phone:{
      type: Sequelize.STRING
    },
    created_at: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn("NOW"),
    },
    updated_at: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn("NOW"),
    },
   })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('profiles');
  }
};
