const express = require('express');
const bcrypt = require('bcrypt');   
const jwt = require('jsonwebtoken');
const AuthUser = require('../models/authUser'); 
const router = express.Router();


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await AuthUser.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        //check passowrd
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

module.exports = router;