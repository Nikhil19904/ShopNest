const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require("./user");
const Product = require("./product");

const CartItem = sequelize.define("CartItem", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
}, { timestamps: false });

// Associations
CartItem.belongsTo(User, { foreignKey: "userId" });
CartItem.belongsTo(Product, { foreignKey: "productId" });

module.exports = CartItem;
