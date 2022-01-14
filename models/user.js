// name (string, must not be empty)
// username (string, must not be empty)
const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('../util/db');

class User extends Model {}
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
      },
    },
    password: {
      type: DataTypes.STRING,
      defaultValue: 'secret',
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'users',
  }
);

module.exports = User;
