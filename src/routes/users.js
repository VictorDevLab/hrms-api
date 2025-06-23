const express = require('express');
const router = express.Router();
const userController = require('../src/controllers/usersController');


router.post('/createNew', userController.createUser);
router.get('/getAll', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/updateUser/:id', userController.updateUser);
// router.delete('/deleteUser/:id', userController.deleteUser);

module.exports = router;