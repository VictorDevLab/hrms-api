const ProjectModel = require('../models/Project')

const getAllProjects = async (req, res) => {
    try {
        const projects = await ProjectModel.find()
        if (!projects) {
            return res.status(404).json({ message: "No Projects Found" })
        }
        res.status(200).json(projects)
    } catch (error) {
       console.error('Error fetching projects:', error);
       res.status(500).json({ message: 'Internal server error' });
    }
}
const createProject = async(req, res) => {
    const {assignedTo, title, description, status, priority, dueDate} = req.body

    if(!assignedTo|| !title|| !description|| !status|| !priority|| !dueDate) {
        return res.status(400).json({message: 'All fields are required'})
    }
    try {
        const project = new ProjectModel({
            assignedTo,
            title,
            description,
            status,
            priority,
            dueDate,
        })

        const existingProject = await ProjectModel.findOne({title})
        if(existingProject) {
           return res.status(400).json({message: "Project already exists"})
        }
        await project.save()
        res.status(201).json(project)
    } catch (error) {
        console.log("Error Creating Project:", error)
        res.status(500).json({message: "Internal Server Error"})
    }
}

const updateProjectById = async (req, res) => {
    const projectId = req.params.id
    const { assignedTo, title, description, status, priority, dueDate } = req.body

    if (!assignedTo || !title || !description || !status || !priority || !dueDate) {
        return res.status(400).json({ message: 'All fields are required' })
    }
    try {
        const project = await ProjectModel.findByIdAndUpdate(projectId, req.body, { new: true, runValidators: true })
        if (!project) {
            return res.status(404).json({ message: "Project not found" })
        }
        res.status(200).json(project)
    } catch (error) {
        console.log("Error Updating Project:", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

const deleteProjectById = async(req, res) => {
    const projectId = req.params.id
    try {
        const project = await ProjectModel.findByIdAndDelete(projectId)
        if(!project) {
            return res.status(404).json({message: "Project not found"})
        }
        res.status(200).json({message: "Project deleted successfully"})
    } catch (error) {
        console.log("Error Deleting Project:", error)
        res.status(500).json({message: "Internal Server Error"})
    }
}

module.exports = {
    createProject,
    updateProjectById,
    deleteProjectById,
    getAllProjects
}