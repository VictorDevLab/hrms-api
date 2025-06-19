const express = require('express')
const router = express.Router()
const projectsController = require('../controllers/projectsController')

router.get('/', projectsController.getAllProjects)
router.put('/:id', projectsController.updateProjectById)
router.post('/createNew', projectsController.createProject)
router.delete('/deleteTask/:id', projectsController.deleteProjectById)

module.exports = router;