// server.js (фрагмент)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const { sequelize } = require('./models');
const departmentRoutes = require('./routes/departmentRoutes');
const employeeRoutes = require('./routes/employeeRoutes');

const { setupSwagger } = require('./swaggerSetup');

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

const corsOptions = {
    origin: process.env.ALLOWED_ORIGIN || 'http://localhost:3000',
    optionsSuccessStatus: 200
  };
const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 15 минут
    max: 100, // максимум 100 запросов
    message: { error: 'Слишком много запросов, попробуйте позже' }
});

app.use(limiter);
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));
app.use('/api/departments', departmentRoutes);
app.use('/api/employees', employeeRoutes);

setupSwagger(app);

sequelize.authenticate()
    .then(() => {
        console.log('✅ Успешное подключение к PostgreSQL');
        app.listen(PORT, () => {
            console.log(`🚀 Сервер запущен на порту ${PORT}`);
            if (process.env.ENABLE_SWAGGER === 'true') {
                console.log('📘 Документация API: http://localhost:3000/api-docs');
            }
        });
    })
    .catch(err => {
        console.error('❌ Ошибка подключения к БД:', err.message);
        process.exit(1);
    });