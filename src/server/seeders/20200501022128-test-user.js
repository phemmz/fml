'use strict';
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    const salt = bcrypt.genSaltSync(10);

    const testPass1 = bcrypt.hashSync('123456', salt);
    const testPass2 = bcrypt.hashSync('password', salt);
    return queryInterface.bulkInsert('Users', [{
      id: uuidv4(),
      name: 'theagromall',
      email: 'test@theagromall.com',
      password: testPass2,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv4(),
      name: 'John Doe',
      email: 'user@user.com',
      password: testPass1,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete('Users', null, {});
  }
};
