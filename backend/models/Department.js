// models/Department.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const Department = sequelize.define('Department', {
    department_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    department_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    budget: {
        type: DataTypes.DECIMAL(12, 2)
    },
    established_date: {
        type: DataTypes.DATEONLY
    }
}, {
    tableName: 'departments',
    timestamps: false
});

module.exports = Department;