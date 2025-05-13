const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// router.get('/', employeeController.renderEmployee);
router.delete('/:id', employeeController.deleteEmployee);

module.exports = router;