const mongoose = require('mongoose')
const User = require('./User')

const leaveRequestSchema = new mongoose.Schema({
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
   },
   leaveType: {
      type: String,
      required: true
   },
   leaveOption: {
      type: String,
      required: true
   },
   startDate: {
      type: Date,
      required: true
   },
   numberOfDays: {
      type: Number,
      required: true
   },
   endDate: {
      type: Date,
      required: true
   },
   emergencyContact: {
      type: String,
      required: true
   },
   notificationEmail: {
      type: String,
      required: true
   },
   reason: {
      type: String,
      required: true
   },
   status: {
      type: String,
      default: 'pending'
   },
   approver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
   }

}, { timestamps: true });

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);