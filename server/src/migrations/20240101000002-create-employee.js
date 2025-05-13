'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('employees', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      full_name: {
        type: Sequelize.STRING
      },
      branch_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'branches',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      position_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'positions',
          key: 'id'
        },
        onDelete: 'SET NULL'
      },
      join_date: {
        type: Sequelize.DATE
      },
      salary: {
        type: Sequelize.FLOAT
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Employees');
  }
};