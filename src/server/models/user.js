import bcrypt from 'bcrypt';

const UserModel = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Name can not be empty',
        },
      },
    },
    email: {
      type: DataTypes.STRING,
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
      type: DataTypes.STRING,
      len: [5, 30],
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM,
      values: ['admin', 'user'],
      defaultValue: 'user',
      allowNull: false,
    }
  }, {});

  User.beforeCreate((User) => {
    const salt = bcrypt.genSaltSync(10);

    User.password = bcrypt.hashSync(User.password, salt);
  });

  User.associate = models => {
    User.hasMany(models.Market, {
      foreignKey: 'userId',
      as: 'markets',
    });
  };

  return User;
};

export default UserModel;
