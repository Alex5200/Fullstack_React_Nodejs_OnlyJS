// swaggerSetup.js
const swaggerUi = require('swagger-ui-express');
const { swaggerSpec } = require('./swagger');

function setupSwagger(app) {
    if (process.env.ENABLE_SWAGGER === 'true') {
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
        console.log('📄 Swagger UI доступен по адресу: http://localhost:3000/api-docs');
    }
}

module.exports = { setupSwagger };