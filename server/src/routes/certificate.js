const express = require('express');
const {getCertificate, getCertificateSSR} = require("../controllers/employeeController");
const router = express.Router();


router.post('/', getCertificate);


module.exports = router;