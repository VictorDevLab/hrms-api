const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');


router.post('/createNew', userController.createUser);

module.exports = router;