const express = require('express');
const bcrypt = require('bcrypt');   
const jwt = require('jsonwebtoken');
const AuthUser = require('../models/authUser'); 
const router = express.Router();


router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await AuthUser.findOne({email});
    if (existingUser) 
        return res.status(400).json({ message: 'User already exists' });
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    const newUser = new AuthUser({
      email,
      password: hashedPassword,
    }); 
    // Save the user to the database
    await newUser.save();       
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {     
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
);
    

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

router.post('/validate-token', async (req, res) => {
    const token = req.body.token;
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await AuthUser.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ valid: true, user: { id: user._id, email: user.email } });
    } catch (error) {
        res.status(401).json({ valid: false, message: 'Invalid token' });
    }
})


module.exports = router;