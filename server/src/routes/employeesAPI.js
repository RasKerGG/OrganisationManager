const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

router.get('/', employeeController.getEmployees);
router.get('/:id', employeeController.getEmployeeById)
router.post('/', employeeController.addEmployee);
router.delete('/:id', employeeController.deleteEmployee);
router.get('/certificate', employeeController.getCertificate);
router.patch('/:id', employeeController.editEmployee);
router.post('/view', employeeController.getEmployees);

module.exports = router;