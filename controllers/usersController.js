const express = require('express');
const newUser = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createUser = async (req, res) => {
    const { email, password, personal, employment, compensation } = req.body;
    if (!email || !password || !personal || !employment || !compensation) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {

        const user = new newUser({
            email,
            password,
            personal,
            employment,
            compensation
        });
        // Check if user already exists
        const existingUser = await user.findOne({email});
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        user.password = hashedPassword;
        //ALSO TODO: generate a unique employee ID for the user

        //Add new properties to the user object(firstLogin..)
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    createUser
}