const mongoose = require('mongoose');
const userModel = require('./User');

const assetSchema = new mongoose.Schema({
    assetName: {
        type: String,
        required: true
    },
    assetType: {
        type: String,
        required: true
    },
    assetCode: {
        type: String,
        required: true,
        unique: true
    },
    assignedTo: {
        //type: mongoose.Schema.Types.ObjectId,
        type: String,
        ref: 'User',
        required: false
    },
    assignedDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Available', 'Assigned', 'Maintenance', 'Retired'],
        default: 'Available'
    },
    description: {
        type: String,
        required: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Asset', assetSchema);