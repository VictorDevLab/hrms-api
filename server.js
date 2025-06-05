const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
require('dotenv').config();
const authRoutes = require('./routes/auth'); 

const app = express();

let corsOptions = {
   origin : ['http://localhost:5173', 'https://production-domain.com'],
   methods: ['GET', 'POST', 'PUT', 'DELETE'],
}

app.use(cors(corsOptions)); 
const port = process.env.PORT || 3001;
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');  
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
