'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Branch extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Branch.belongsTo(models.Branch, {as: 'parent', foreignKey: 'parentId'});
      Branch.hasMany(models.Branch, {as: 'children', foreignKey: 'parentId'});

      Branch.hasMany(models.Employee, {foreignKey: 'branchId'});
    }
  }
  Branch.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    parentId: {
      type: DataTypes.INTEGER,
      field: 'parent_id', // Соответствие имени в БД
      allowNull: true,
      references: {
        model: 'Branch',
        key: 'id'
      }
    },
    name: {
      field: 'name',
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Branch',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Branch;
};