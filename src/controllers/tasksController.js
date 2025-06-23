const TaskModel = require('../src/models/Task')

const getAllTasks = async (req, res) => {
    try {
        const tasks = await TaskModel.find()
        if (!tasks) {
            return res.status(404).json({ message: "No Tasks Found" })
        }
        res.status(200).json(tasks)
    } catch (error) {
       console.error('Error fetching tasks:', error);
       res.status(500).json({ message: 'Internal server error' });
    }
}
const createTask = async(req, res) => {
    const {assignedTo, title, description, status, priority, dueDate, project} = req.body

    if(!assignedTo|| !title|| !description|| !status|| !priority|| !dueDate) {
        return res.status(400).json({message: 'All fields are required'})
    }
    try {
        const task = new TaskModel({
            assignedTo,
            title,
            description,
            status,
            priority,
            dueDate,
            project
        })

        const existingTask = await TaskModel.findOne({title})
        if(existingTask) {
           return res.status(400).json({message: "Task already exists"})
        }
        await task.save()
        res.status(201).json(task)
    } catch (error) {
        console.log("Error Creating Task:", error)
        res.status(500).json({message: "Internal Server Error"})
    }
}

const updateTaskById = async (req, res) => {
    const taskId = req.params.id
    const { assignedTo, title, description, status, priority, dueDate, project } = req.body

    if (!assignedTo || !title || !description || !status || !priority || !dueDate) {
        return res.status(400).json({ message: 'All fields are required' })
    }
    try {
        const task = await TaskModel.findByIdAndUpdate(taskId, req.body, { new: true, runValidators: true })
        if (!task) {
            return res.status(404).json({ message: "Task not found" })
        }
        res.status(200).json(task)
    } catch (error) {
        console.log("Error Updating Task:", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

const deleteTaskById = async(req, res) => {
    const taskId = req.params.id
    try {
        const task = await TaskModel.findByIdAndDelete(taskId)
        if(!task) {
            return res.status(404).json({message: "Task not found"})
        }
        res.status(200).json({message: "Task deleted successfully"})
    } catch (error) {
        console.log("Error Deleting Task:", error)
        res.status(500).json({message: "Internal Server Error"})
    }
}

module.exports = {
    createTask,
    updateTaskById,
    deleteTaskById,
    getAllTasks
}