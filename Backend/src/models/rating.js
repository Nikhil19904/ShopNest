// models/Rating.js
module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define('Rating', {
    // other fields...
    productId: {
      type: DataTypes.INTEGER,
      allowNull: true,  // <-- important for SET NULL
      references: {
        model: 'Products',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
  });

  Rating.associate = (models) => {
    Rating.belongsTo(models.Product, {
      foreignKey: 'productId',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  };

  return Rating;
};
