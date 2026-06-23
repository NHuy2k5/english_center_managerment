'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
    */
    await queryInterface.bulkInsert('roles', 
    [
      {
        id: 1,
        name: 'admin',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        name: 'student',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        name: 'teacher',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 4,
        name: 'parent',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
    */
    await queryInterface.bulkDelete('roles', null, {});
  }
};
