module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: 'Name can not be empty',
          },
        },
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: 'This email already exist'
        },
        validate: {
          notEmpty: {
            args: true,
            msg: 'Email can not be empty',
          },
        },
      },
      password: {
        type: Sequelize.STRING,
        len: [5, 30],
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM('admin', 'user'),
        defaultValue: 'user',
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};
