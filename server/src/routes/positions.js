const express = require('express');
const router = express.Router();
const positionController = require('../controllers/positionController');

router.get('/', positionController.getPosition);
router.post('/', positionController.addPosition);

module.exports = router;