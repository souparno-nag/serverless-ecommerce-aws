const express = require('express');
const {registerSeller, loginSeller} = require('../controllers/auth-controllers');
const router = express.Router();

router.post("/seller/register", registerSeller);
router.post("/seller/login", loginSeller);

module.exports = router;