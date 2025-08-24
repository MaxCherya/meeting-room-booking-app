/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: Sequelize.STRING,
      email: { type: Sequelize.STRING, unique: true },
      passwordHash: Sequelize.STRING,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });

    await queryInterface.createTable('Rooms', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: Sequelize.STRING,
      description: Sequelize.TEXT,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });

    await queryInterface.createTable('Bookings', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      roomId: {
        type: Sequelize.INTEGER,
        references: { model: 'Rooms', key: 'id' },
        onDelete: 'CASCADE',
      },
      createdById: {
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id' },
        onDelete: 'SET NULL',
      },
      startsAt: Sequelize.DATE,
      endsAt: Sequelize.DATE,
      description: Sequelize.TEXT,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });

    await queryInterface.addIndex('Bookings', ['roomId', 'startsAt', 'endsAt']);

    await queryInterface.createTable('RoomMembers', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      roomId: {
        type: Sequelize.INTEGER,
        references: { model: 'Rooms', key: 'id' },
        onDelete: 'CASCADE',
      },
      userId: {
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
      },
      role: { type: Sequelize.ENUM('admin', 'user') },
      roomUserUnique: { type: Sequelize.STRING, unique: true },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('RoomMembers');
    await queryInterface.dropTable('Bookings');
    await queryInterface.dropTable('Rooms');
    await queryInterface.dropTable('Users');
  },
};