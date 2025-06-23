const express = require('express');
const router = express.Router();
const refreshTokenController = require('../src/controllers/refreshTokenController');


router.post('/', refreshTokenController.handleRefreshToken);


module.exports = router;