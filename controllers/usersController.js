const express = require('express');
const newUser = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const getAllUsers = async (req, res) => {
     try {
        const users = await newUser.find();
        res.status(200).json(users);
     } catch (error) {
        console.error('Error fetching users:', error);
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
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        user.password = hashedPassword;
        //ALSO TODO: generate a unique employee ID for the user        

        // Generate a unique employee ID (ALPH- followed by count number based on the users collection)
        const userCount = await newUser.countDocuments();
        user.employment.employeeId = `ALPH-${userCount + 1}`;
        //Add new properties to the user object(firstLogin..)
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    createUser,
    getAllUsers
}