// docs/swaggerEmployees.js
/**
 * @swagger
 * tags:
 *   name: Employees
 *   description: Операции с сотрудниками
 */

/**
 * @swagger
 * /api/employees:
 *   get:
 *     summary: Получить список сотрудников с пагинацией
 *     tags: [Employees]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Номер страницы
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Количество записей на странице
 *     responses:
 *       200:
 *         description: Список сотрудников
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Employee'
 */

/**
 * @swagger
 * /api/employees:
 *   post:
 *     summary: Создать нового сотрудника
 *     tags: [Employees]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Employee'
 *     responses:
 *       201:
 *         description: Сотрудник успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 */

/**
 * @swagger
 * /api/employees/{id}:
 *   get:
 *     summary: Получить сотрудника по ID
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID сотрудника
 *     responses:
 *       200:
 *         description: Данные сотрудника
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       404:
 *         description: Сотрудник не найден
 */

/**
 * @swagger
 * /api/employees/{id}:
 *   put:
 *     summary: Обновить сотрудника по ID
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID сотрудника
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Employee'
 *     responses:
 *       200:
 *         description: Обновлённые данные сотрудника
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       404:
 *         description: Сотрудник не найден
 */

/**
 * @swagger
 * /api/employees/{id}:
 *   delete:
 *     summary: Удалить сотрудника по ID
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID сотрудника
 *     responses:
 *       204:
 *         description: Сотрудник успешно удалён
 *       404:
 *         description: Сотрудник не найден
 */