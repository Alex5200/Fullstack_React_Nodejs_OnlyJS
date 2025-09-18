// controllers/employeeController.js
const { sequelize } = require('../models');
const Employee = require('../models/Employee');
const Department = require('../models/Department');

exports.getAllEmployees = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    if (limit <= 0 || page <= 0) {
        return res.status(400).json({ error: 'Параметры page и limit должны быть положительными числами' });
    }

    try {
            const query = `
            SELECT * FROM employees   
                ORDER BY employee_id  
                    LIMIT $1 OFFSET $2;
        `;

        const employees = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT,
            bind: [limit, offset] 
        });

        res.status(200).json({
            page,
            limit,
            employees
        });
    } catch (error) {
        console.error('Ошибка получения сотрудников:', error.message);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
};

// Создать сотрудника
exports.createEmployee = async (req, res) => {
    try {
        const employee = await Employee.create(req.body);
        res.status(201).json(employee);
    } catch (error) {
        console.error('Ошибка создания сотрудника:', error.message);
        res.status(400).json({ error: error.message });
    }
};

// Получить сотрудника по ID с отделом
exports.getEmployeeById = async (req, res) => {
    try {
        const { id } = req.params; // department_id

        const employee = await Employee.findAll({
            where: { department_id: id },
            include: [{ 
                model: Department, 
                as: 'Department', 
                attributes: ['department_name'] // опционально: только название
            }],
            order: [['employee_id', 'ASC']] // сортировка по ID
        });
        if (!employee) {
            return res.status(404).json({ message: 'Сотрудник не найден' });
        }
        res.status(200).json(employee);
    } catch (error) {
        console.error('Ошибка получения сотрудника:', error.message);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
};

// Обновить сотрудника
exports.updateEmployee = async (req, res) => {
    try {
        const [updated] = await Employee.update(req.body, {
            where: { employee_id: req.params.id }
        });
        if (!updated) {
            return res.status(404).json({ message: 'Сотрудник не найден' });
        }
        const updatedEmployee = await Employee.findByPk(req.params.id);
        res.status(200).json(updatedEmployee);
    } catch (error) {
        console.error('Ошибка обновления сотрудника:', error.message);
        res.status(400).json({ error: error.message });
    }
};

// Удалить сотрудника
exports.deleteEmployee = async (req, res) => {
    try {
        const deleted = await Employee.destroy({
            where: { employee_id: req.params.id }
        });
        if (!deleted) {
            return res.status(404).json({ message: 'Сотрудник не найден' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Ошибка удаления сотрудника:', error.message);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
};