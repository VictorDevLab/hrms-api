const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');


router.post('/createNew', userController.createUser);
router.get('/getAll', userController.getAllUsers);
// router.get('/getUserById/:id', userController.getUserById);
// router.put('/updateUser/:id', userController.updateUser);
// router.delete('/deleteUser/:id', userController.deleteUser);

module.exports = router;