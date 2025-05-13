'use strict';
const {
  Model
} = require('sequelize');
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Employee.belongsTo(models.Branch, {
        foreignKey: 'branchId',
        as: 'branch'
      });
      Employee.belongsTo(models.Position, {
        foreignKey: 'positionId',
        as: 'position'
      });
    }
  }
  Employee.init({
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fullName: {
      allowNull: false,
      type: DataTypes.STRING
    },
    joinDate: {
      allowNull: false,
      type: DataTypes.DATE
    },
    branchId: {
      type: Sequelize.INTEGER,
      field: 'branch_id',
      references: {
        model: 'Branch',
        key: 'id'
      },
      onDelete: 'SET NULL'
    },
    positionId: {
      type: Sequelize.INTEGER,
      field: 'position_id',
      references: {
        model: 'Position',
        key: 'id'
      },
      onDelete: 'SET NULL'
    },
    salary:{
      allowNull: false,
      type: DataTypes.FLOAT
    }
  }, {
    sequelize,
    modelName: 'Employee',
    tableName: 'employees',
    underscored: true
  });
  return Employee;
};