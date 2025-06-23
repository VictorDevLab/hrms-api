const express = require('express')
const router = express.Router()
const tasksController = require('../controllers/tasksController')

router.get('/', tasksController.getAllTasks)
router.put('/:id', tasksController.updateTaskById)
router.post('/createNew', tasksController.createTask)
router.delete('/deleteTask/:id', tasksController.deleteTaskById)

module.exports = router;