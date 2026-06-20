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
        name: "Tiếng Anh cấp 1",
        created_at: new Date(),
        updated_at: new Date()
      }, 
      {
        name: "Tiếng Anh cấp 2",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "Tiếng Anh cấp 3",
        created_at: new Date(),
        updated_at: new Date()
      }, 
      {
        name: "TOEIC",
        created_at: new Date(),
        updated_at: new Date()
      }, 
      {
        name: "IELTS",
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
