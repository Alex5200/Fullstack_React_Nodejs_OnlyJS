// models/Employee.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');
const Department = require('./Department');

const Employee = sequelize.define('Employee', {
    employee_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    full_name: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    salary: {
        type: DataTypes.DECIMAL(10, 2)
    },
    hire_date: {
        type: DataTypes.DATEONLY
    },
    age: {
        type: DataTypes.INTEGER
    },
    department_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Department,
            key: 'department_id'
        },
        onDelete: 'SET NULL'
    }
}, {
    tableName: 'employees',
    timestamps: false
});

Employee.belongsTo(Department, { foreignKey: 'department_id' });
Department.hasMany(Employee, { foreignKey: 'department_id' });

module.exports = Employee;