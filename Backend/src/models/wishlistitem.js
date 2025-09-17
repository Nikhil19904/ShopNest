const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");   // ✅ destructure
const Wishlist = require("./wishlist");
const Product = require("./product");

const WishlistItem = sequelize.define("WishlistItem", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
}, { timestamps: false });

// Associations
WishlistItem.belongsTo(Wishlist, { foreignKey: "wishlistId" });
WishlistItem.belongsTo(Product, { foreignKey: "productId" });

module.exports = WishlistItem;
