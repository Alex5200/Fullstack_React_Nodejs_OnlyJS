// controllers/departmentController.js
const { sequelize } = require('../models');
const Department = require('../models/Department');
const { body, param, validationResult } = require('express-validator'); // 👈 Добавлено

exports.validateDepartment = [
    body('department_name')
      .isLength({ min: 1, max: 100 })
      .withMessage('Название отдела обязательно и должно быть до 100 символов'),
    body('budget')
      .optional()
      .isDecimal()
      .withMessage('Бюджет должен быть числом'),
    body('established_date')
      .optional()
      .isISO8601()
      .withMessage('Дата должна быть в формате YYYY-MM-DD')
  ];
  exports.validateId = [
    param('id').isInt({ min: 1 }).withMessage('ID должен быть положительным числом')
  ];
// Получить все отделы с пагинацией (через сырой SQL, безопасно)
exports.getAllDepartments = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Валидация параметров
    if (limit <= 0 || page <= 0) {
        return res.status(400).json({ error: 'Параметры page и limit должны быть положительными числами' });
    }

    try {
        const query = `
            SELECT * FROM departments
            ORDER BY department_id
                LIMIT $1 OFFSET $2;
        `;

        const result = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT,
            bind: [limit, offset] 
        });

        res.status(200).json({
            page,
            limit,
            result
        });
    } catch (error) {
        console.error('Ошибка получения отделов:', error.message);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
};

// Создать отдел
exports.createDepartment = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
        const allowedFields = ['department_name', 'budget', 'established_date'];
        const sanitizedBody = {};
        allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
            sanitizedBody[field] = req.body[field];
        }
        });
        const department = await Department.create(req.body);
        res.status(201).json(department);
    } catch (error) {
        console.error('Ошибка создания отдела:', error.stack);
        res.status(400).json({ error: error.message });
    }
};

// Получить отдел по ID
exports.getDepartmentById = async (req, res) => {
    try {
        const department = await Department.findByPk(req.params.id);
        if (!department) {
            return res.status(404).json({ message: 'Отдел не найден' });
        }
        res.status(200).json(department);
    } catch (error) {
        console.error('Ошибка получения отдела:', error.message);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
};

// Обновить отдел
exports.updateDepartment = async (req, res) => {
    try {
        const [updated] = await Department.update(req.body, {
            where: { department_id: req.params.id }
        });
        if (!updated) {
            return res.status(404).json({ message: 'Отдел не найден' });
        }
        const updatedDepartment = await Department.findByPk(req.params.id);
        res.status(200).json(updatedDepartment);
    } catch (error) {
        console.error('Ошибка обновления отдела:', error.message);
        res.status(400).json({ error: error.message });
    }
};

exports.deleteDepartment = async (req, res) => {
    try {
        const deleted = await Department.destroy({
            where: { department_id: req.params.id }
        });
        if (!deleted) {
            return res.status(404).json({ message: 'Отдел не найден' });
        }
        res.status(204).send(); // No Content
    } catch (error) {
        console.error('Ошибка удаления отдела:', error.message);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
};