const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestsController');

router.post('/create', requestController.createLeaveRequest);

module.exports  = router;