const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

router.get('/', employeeController.getEmployees);
router.post('/', employeeController.addEmployee);
router.delete('/:id', employeeController.deleteEmployee);
router.get('/certificate', employeeController.getCertificate);
router.patch('/', employeeController.editEmployee);

module.exports = router;