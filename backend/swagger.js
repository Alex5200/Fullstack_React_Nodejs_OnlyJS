// swagger.js
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Company API',
            version: '1.0.0',
            description: 'REST API для управления отделами и сотрудниками компании',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Локальный сервер разработки',
            },
        ],
        components: {
            schemas: {
                Department: {
                    type: 'object',
                    required: ['department_name'],
                    properties: {
                        department_id: { type: 'integer', description: 'Уникальный ID отдела' },
                        department_name: { type: 'string', description: 'Название отдела' },
                        budget: { type: 'number', format: 'float', description: 'Бюджет отдела' },
                        established_date: { type: 'string', format: 'date', description: 'Дата основания' },
                    },
                },
                Employee: {
                    type: 'object',
                    required: ['full_name'],
                    properties: {
                        employee_id: { type: 'integer', description: 'Уникальный ID сотрудника' },
                        full_name: { type: 'string', description: 'ФИО сотрудника' },
                        salary: { type: 'number', format: 'float', description: 'Зарплата' },
                        hire_date: { type: 'string', format: 'date', description: 'Дата приёма на работу' },
                        age: { type: 'integer', description: 'Возраст' },
                        department_id: { type: 'integer', description: 'ID отдела' },
                    },
                },
            },
        },
    },
    // ✅ Указываем, где искать JSDoc-комментарии — только в папке docs/
    apis: ['./docs/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerSpec };