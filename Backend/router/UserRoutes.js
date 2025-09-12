const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Import the auth middleware from your middleware folder
const auth = require('../middleware/auth')

// Input validation middleware
const validateInput = (req, res, next) => {
    const { username, email, password } = req.body;
    
    if (password && password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    
    if (email && !email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
        return res.status(400).json({ message: "Invalid email format" });
    }
    
    next();
};

router.post('/register', validateInput, async (req, res) => {
    const { username, email, password } = req.body;

    try {
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });
        if (existingUser) {
            return res.status(400).json({ 
                message: "User with this email or username already exists" 
            });
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const UserData = await User.create({ 
            username, 
            email, 
            password: hashPassword 
        });

        const token = jwt.sign(
            { id: UserData._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }
        );

        res.status(201).json({ 
            message: "User registered successfully", 
            token,
            user: {
                id: UserData._id,
                username: UserData.username,
                email: UserData.email
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            message: "Internal Server Error",
            error: error.message 
        });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const UserData = await User.findOne({ email });
        if (!UserData) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, UserData.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: UserData._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }
        );

        res.status(200).json({ 
            message: "Login successful", 
            token,
            user: {
                id: UserData._id,
                username: UserData.username,
                email: UserData.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            message: "Internal Server Error",
            error: error.message 
        });
    }
});

router.post('/logout', auth, async(req, res) => {
    try {
        // In a production environment, you should implement token blacklisting here
        res.status(200).json({ message: "Successfully Logged Out" });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ 
            message: "Internal Server Error",
            error: error.message 
        });
    }
});

// FIXED: Export only the router (not an object)
module.exports = router;
