const mongoose = require('mongoose');
const User = require('./User');
const Project = require('./Project');

const taskSchema = new mongoose.Schema({
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Created', 'In Progress', 'Completed', 'On Hold'],
        default: 'Created'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    dueDate: {
        type: Date,
        required: true
    },
    project: {
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'Project',
         type: String,
    }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);