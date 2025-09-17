const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");  // ✅ yahan destructure karna hai

const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  password: { type: DataTypes.STRING(255), allowNull: false },
});

module.exports = User;
