const MarketModel = (sequelize, DataTypes) => {
  const Market = sequelize.define('Market', {
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
    description: {
      type: DataTypes.STRING
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Category can not be empty',
        },
      },
    },
    images: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Address can not be empty',
        },
      },
    }
  }, {});

  Market.associate = models => {
    Market.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE', // deleting a user will also delete markets created by the user
    });
  };

  return Market;
};

export default MarketModel;
