require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Recipe = require('./router/Receipe');
const UserRouter = require('./router/UserRoutes');

const app = express();

// MongoDB connection with connection reuse for serverless
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }
  
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
      bufferMaxEntries: 0,
      useFindAndModify: false,
      useCreateIndex: true
    });
    
    isConnected = db.connections[0].readyState;
    console.log("MongoDB is connected ra daiii....");
  } catch (err) {
    console.log("MongoDB Kolaruu", err);
    throw err;
  }
};

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to DB before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Routes
app.use('/api/recipe', Recipe);
app.use('/api/auth', UserRouter);

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Server is running on Vercel!' });
});


// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server is Running da..... on port ${PORT}`);
  });
}

// Export for Vercel
module.exports = app;