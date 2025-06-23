const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
require('dotenv').config();
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const jwtVerify = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser')
const authRoutes = require('./src/routes/auth'); 
const refreshRoute = require('./src/routes/refresh'); 
const userRoutes = require('./src/routes/users');
const requestRoutes = require('./src/routes/requests');
const taskRoutes = require('./src/routes/tasks')
const projectRoutes = require('./src/routes/projects')

const app = express();

let corsOptions = {
   origin : ['http://localhost:5173', 'https://production-domain.com'],
   credentials: true,
   methods: ['GET', 'POST', 'PUT', 'DELETE'],
   allowedHeaders: ['Content-Type', 'Authorization'],
}

// custom middleware logger
app.use(logger);
app.use(cors(corsOptions)); 
const port = process.env.PORT || 3001;
app.use(express.json());
app.use(cookieParser())


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
app.use('/api/refresh', refreshRoute);

app.use('/api/users',jwtVerify, userRoutes);
app.use('/api/requests',jwtVerify, requestRoutes);
app.use('/api/tasks',jwtVerify, taskRoutes);
app.use('/api/projects',jwtVerify, projectRoutes);



app.use(errorHandler);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
