'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          allowNull: false
      },
      name: {
          type: Sequelize.STRING,
          allowNull: false
      },
      price: {
          type: Sequelize.INTEGER,
          allowNull: false
      },
      stock: {
          type: Sequelize.INTEGER,
          allowNull: false
      },
      categoryId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
              model: 'categories', 
              key: 'id',
          },
          onDelete: 'CASCADE' 
      },
      image1: {
          type: Sequelize.STRING,
          allowNull: false
      },
      image2: {
          type: Sequelize.STRING,
          allowNull: true
      },
      description: {
          type: Sequelize.TEXT,
          allowNull: true
      },
      createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW
      },
      updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW
      }
  });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Products');
  }
};
