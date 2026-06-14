'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
    */
    await queryInterface.bulkInsert('category_courses', [
      {
      name: 'IELTS: Foundation A',
      created_at: new Date(),
      updated_at: new Date()
      },
      {
      name: 'IELTS: Foundation B',
      created_at: new Date(),
      updated_at: new Date()
      },
      {
      name: 'IELTS: Basic',
      created_at: new Date(),
      updated_at: new Date()
      },
      {
      name: 'IELTS: Intermediate',
      created_at: new Date(),
      updated_at: new Date()
      },
      {
      name: 'IELTS: High Intermediate',
      created_at: new Date(),
      updated_at: new Date()
      },
      {
      name: 'IELTS: Advanced',
      created_at: new Date(),
      updated_at: new Date()
      },
      {
      name: 'TOEIC: Foundation A',
      created_at: new Date(),
      updated_at: new Date()
      },
      {
      name: 'TOEIC: Foundation B',
      created_at: new Date(),
      updated_at: new Date()
      },
      {
      name: 'TOEIC: Basic',
      created_at: new Date(),
      updated_at: new Date()
      },
      {
      name: 'TOEIC: Intermediate',
      created_at: new Date(),
      updated_at: new Date()
      },
      {
      name: 'TOEIC: High Intermediate',
      created_at: new Date(),
      updated_at: new Date()
      },
      {
      name: 'TOEIC: Advanced',
      created_at: new Date(),
      updated_at: new Date()
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
