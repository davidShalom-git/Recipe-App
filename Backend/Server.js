require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Recipe = require('./router/Receipe')
const UserRouter = require('./router/UserRoutes')


mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB is connected ra daiii....");
  })
  .catch((err) => {
    console.log("MongoDB Kolaruu", err);
  });



app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(bodyParser.json())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/recipe', Recipe)
app.use('/api/auth', UserRouter)

app.listen(4000,()=> {
    console.log("Server is Running da.....")
})