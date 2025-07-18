const bcrypt = require('bcrypt');   
const jwt = require('jsonwebtoken');
const AuthUser = require('../models/User'); 
require('dotenv').config();


const registerUser = async (req, res) => {
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
};
    

const login =  async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await AuthUser.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        //check password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1hr' });
        const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1hr' });

        //save refresh token to user
        user.refreshToken = refreshToken;
        await user.save();
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'Strict', 
            maxAge: 60 * 60 * 1000 
        });
        console.log("cookie", {"jwt": refreshToken})
        res.json({ accessToken, user: { id: user._id } });
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const logout = async (req, res) => {
  //on client side also delete the access token
   try {
          const cookies = req.cookies
          if (!cookies?.jwt) {
              console.log('No jwt cookie found');
              return res.sendStatus(204)
          }
          const refreshToken = cookies.jwt
          const user = await AuthUser.findOne({ refreshToken });
          if (!user) {
              res.clearCookie('jwt', { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 1000 });
              return res.sendStatus(204)
          }
          //Delete refresh token from user
          user.refreshToken = '';
          await user.save();
          res.clearCookie('jwt', { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            maxAge: 60 * 60 * 1000 
          });
          res.sendStatus(204); 
  
      } catch (error) {
          res.status(500).json({ error: error.message });
      }
}

module.exports = {
    registerUser,
    login,
    logout
};