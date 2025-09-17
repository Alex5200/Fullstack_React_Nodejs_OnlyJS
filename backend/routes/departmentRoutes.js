// routes/departmentRoutes.js
const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');

router.get('/', departmentController.getAllDepartments);
router.post('/', 
    departmentController.validateDepartment,
    departmentController.createDepartment);
router.get('/:id', 
    departmentController.validateId,
    departmentController.getDepartmentById);
router.put('/:id',
    departmentController.validateId, 
    departmentController.updateDepartment);
router.delete('/:id', 
    departmentController.validateId, 
    departmentController.deleteDepartment);

module.exports = router;