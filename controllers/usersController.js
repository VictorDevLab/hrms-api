const express = require('express');
const newUser = require('../models/User');
const bcrypt = require('bcrypt');


const getAllUsers = async (req, res) => {
     try {
        const users = await newUser.find().lean();
        if(!users?.length) {
            return res.status(400).json({message: "No Users Found"})
        }
        res.status(200).json(users);
     } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
     }
}
const getUserById = async (req, res) => {
    try {
        const userId = req.params.id
        const user = await newUser.findById(userId).select('-password').lean();
        if (!user) return res.status(400).json({ message: "No user found" })
        res.json(user)
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
const createUser = async (req, res) => {
    const { email, password, personal, employment, leaves, compensation } = req.body;
    if (!email || !password || !personal || !employment || !compensation) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {

        const user = new newUser({
            email,
            password,
            personal,
            employment,
            leaves,
            compensation
        });
        // Check if user already exists
        const existingUser = await newUser.findOne({email});
        console.log("existing user", existingUser);
        if (existingUser) {
            //409 - conflict
            return res.status(409).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        user.password = hashedPassword;
        //ALSO TODO: generate a unique employee ID for the user        

        // Generate a unique employee ID (ALPH- followed by count number based on the users collection)
        const userCount = await newUser.countDocuments();
        user.employment.employeeId = `ALPH-${userCount + 1}`;
        //TODO: Add new properties to the user object(firstLogin..)
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateUser = async (req, res) => {
    try {
        const { email, password, personal, employment, leaves, compensation } = req.body;
        if (!email || !password || !personal || !employment || !compensation) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const userId = req.params.id
        const user = await newUser.findByIdAndUpdate(userId, req.body, { new: true, runValidators: true })

        if (!user) res.status(404).json({ message: 'No User Found!' })
        res.status(200).json(user)
    } catch (error) {
        res.status(400).json({ message: 'Failed to update user' })
    }
}
module.exports = {
    createUser,
    getAllUsers,
    updateUser,
    getUserById
}