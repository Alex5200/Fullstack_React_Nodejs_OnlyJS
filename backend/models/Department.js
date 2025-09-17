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
        allowNull: false,
        validate: { 
            notEmpty: {
                msg: 'Название отдела не может быть пустым'
            },
            len: {
                args: [1, 100],
                msg: 'Название отдела должно быть от 1 до 100 символов'
            }
        }
    },
    budget: {
        type: DataTypes.DECIMAL(12, 2),
        validate: {
            isDecimal: {
                msg: 'Бюджет должен быть числом'
            },
            min: {
                args: [0],
                msg: 'Бюджет не может быть отрицательным'
            }
        }
    },
    established_date: {
        type: DataTypes.DATEONLY,
        validate: { 
            isDate: {
                msg: 'Некорректная дата'
            }
        }
    }
}, {
    tableName: 'departments',
    timestamps: false
});

module.exports = Department;