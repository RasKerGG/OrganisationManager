const express = require('express');
const {getCertificate} = require("../controllers/employeeController");
const router = express.Router();


router.get('/', getCertificate);

module.exports = router;