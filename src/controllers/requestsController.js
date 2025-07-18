const express = require('express');
const requestModel = require('../models/Request');
const userModel = require('../models/User');

const getAllRequests = async (req, res) => {
    try {
        const requests = await requestModel.find().lean();
        if(!requests?.length) {
            return res.status(400).json({message: "No Requests Found"})
        }
        //return the requests with user details
        const requestsWithUserDetails = await Promise.all(requests.map(async (request) => {
            const user = await userModel.findById(request.userId).lean();
            return {
                ...request,
                user: user ? { id: user._id, name: `${user.personal.firstName} ${user.personal.lastName}`, image: user.personal.image } : null
            };
        }));
        res.status(200).json(requestsWithUserDetails);
     } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).json({ message: 'Internal server error' });
     }
}
const createLeaveRequest = async (req, res) => {
    const { userId, leaveType,leaveOption, startDate, endDate, emergencyContact, notificationEmail, reason, approver, numberOfDays } = req.body;
    if (!userId || !leaveType || !startDate || !endDate || !reason || !approver || !numberOfDays) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const request = new requestModel({
            userId,
            leaveType,
            leaveOption,
            startDate,
            endDate,
            emergencyContact,
            notificationEmail,
            reason,
            numberOfDays,
            approver
        });
        // Check if request already exists??
        // const existingRequest = await requestModel.findOne({userId});
        // console.log("existing request", existingRequest);
        // if (existingRequest) {
        //     //409 - conflict
        //     return res.status(409).json({ message: 'Request already exists' });
        // }
        const savedRequest = await request.save();
        res.status(201).json(savedRequest);
    } catch (error) {
        console.error('Error creating request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getRequestsByUserId = async(req, res) => {
    const id = req.params.id;
    try {
        const requests = await requestModel.find({userId: id}).lean();
        const requestsWithUserDetails = await Promise.all(requests.map(async (request)=> {
            const user = await userModel.findById(request.userId).lean()
            return {
                ...request,
                user: user ? {id: user._id, name: `${user.personal.firstName} ${user.personal.lastName}`, image: user.personal.image} : null
            }
        }))
        res.status(200).json(requestsWithUserDetails);
    } catch (error) {
        console.log("Error fetching requests:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    createLeaveRequest,
    getRequestsByUserId,
    getAllRequests
}