const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../model/userModel');
const Task = require('../model/taskModel');

router.post('/register', async (req, res) => {
    try {
        const { name, userName, password, email, role } = req.body;
        if (!userName || !password || !email || !name) {
            return res.status(422).json({ message: 'Please fill all the fields', success: false });
        }
        if (userName.length < 3) {
            return res.status(422).json({ message: 'Username should be at least 3 characters long', success: false });
        }
        if (password.length < 6) {
            return res.status(422).json({ message: 'Password should be at least 6 characters long', success: false });
        }
        // Check if user already exists by email and username
        const userExist = await User.findOne({ $or: [{ userName }, { email }] });
        if (userExist) {
            return res.status(422).json({ message: 'User already exists', success: false });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new User({
            name,
            userName: userName.toLowerCase(),
            password: hashedPassword,
            email: email.toLowerCase(),
            role
        });
        await user.save();
        user.password = undefined;
        return res.status(201).json({ message: 'User registered successfully', success: true, user });
    } catch (err) {
        console.log("Error in /register", err);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
});


router.post('/login', async (req, res) => {
    try {
        const { key, password } = req.body;
        if (!key || !password) {
            return res.status(422).json({ message: 'Please fill all the fields', success: false });
        }
        const user = await User.findOne({ $or: [{ email: key.toLowerCase() }, { userName: key }] });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credential', success: false });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid email or password', success: false });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        user.password = undefined;
        return res.status(200).json({ message: 'User logged in successfully', token, success: true, user: user });
    } catch (err) {
        console.log("Error in /login", err);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
});


module.exports = router;