const { ar } = require('date-fns/locale');
const mongoose = require('mongoose');
const configurationSchema = new mongoose.Schema({
    companyDetails: {
        type: Object,
    },
    leaveTypes: {
        type: array,
    },
    departments: {
        type: array,
    },
    managers: {
        type: array,
    },

}, { timestamps: true });

module.exports = mongoose.model('Configuration', configurationSchema);