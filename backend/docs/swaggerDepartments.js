// docs/swaggerDepartments.js
/**
 * @swagger
 * tags:
 *   name: Departments
 *   description: Операции с отделами
 */

/**
 * @swagger
 * /api/departments:
 *   get:
 *     summary: Получить список отделов с пагинацией
 *     tags: [Departments]
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
 *         description: Список отделов
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                  :
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Department'
 */

/**
 * @swagger
 * /api/departments:
 *   post:
 *     summary: Создать новый отдел
 *     tags: [Departments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Department'
 *     responses:
 *       201:
 *         description: Отдел успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Department'
 */

/**
 * @swagger
 * /api/departments/{id}:
 *   get:
 *     summary: Получить отдел по ID
 *     tags: [Departments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID отдела
 *     responses:
 *       200:
 *         description: Данные отдела
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Department'
 *       404:
 *         description: Отдел не найден
 */

/**
 * @swagger
 * /api/departments/{id}:
 *   put:
 *     summary: Обновить отдел по ID
 *     tags: [Departments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID отдела
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Department'
 *     responses:
 *       200:
 *         description: Обновлённые данные отдела
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Department'
 *       404:
 *         description: Отдел не найден
 */

/**
 * @swagger
 * /api/departments/{id}:
 *   delete:
 *     summary: Удалить отдел по ID
 *     tags: [Departments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID отдела
 *     responses:
 *       204:
 *         description: Отдел успешно удалён
 *       404:
 *         description: Отдел не найден
 */