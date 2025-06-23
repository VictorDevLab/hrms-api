const express = require('express');
const router = express.Router();
const authController = require('../src/controllers/authController');


router.post('/login', authController.login);
router.post('/register', authController.registerUser);
router.post('/logout', authController.logout);


module.exports = router;