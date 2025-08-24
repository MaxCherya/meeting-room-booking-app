// src/db/migrations/XXXXXXXXXXXXXX-create-booking-attendees.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BookingAttendees', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      bookingId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Bookings', key: 'id' },
        onDelete: 'CASCADE',
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
      },
      bookingUserUnique: { type: Sequelize.STRING, unique: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('BookingAttendees');
  },
};