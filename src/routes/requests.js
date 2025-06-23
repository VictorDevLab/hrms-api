const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestsController');

router.get('/', requestController.getAllRequests);
router.post('/create', requestController.createLeaveRequest);
router.get('/:id', requestController.getRequestsByUserId);

module.exports  = router;