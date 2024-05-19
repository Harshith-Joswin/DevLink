const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const User = require('../models/User');

const router = express.Router();
router.use(express.json());
const JWT_SECRET = process.env.SECRET_KEY;



//accepts firstName,username,email,password,dateOfBirt and creates a new user.
router.post('/signup', [
    // Validating API inputs
    body('firstName', 'at least 3 characters required').isLength({ min: 3 }),
    body('username', 'at least 5 characters required').isLength({ min: 5 }),
    body('email', 'invalid').isEmail(),
    body('password').optional()
        .isLength({ min: 8 }).withMessage('at least 8 characters required')
        .matches(/[A-Z]/).withMessage('must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('must contain at least one lowercase letter')
        .matches(/[0-9]/).withMessage('must contain at least one number')
        .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/).withMessage('must contain at least one special character'),
    body('dateOfBirth', 'required').isDate()
], async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array().map(error => {
                    return { path: error.path, message: error.msg }
                })
            });
        }

        // Destructuring req.body
        const { firstName, username, email, password, dateOfBirth } = req.body;

        // Generating salt and hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Creating user
        const newUser = await User.create({
            email: email.toLowerCase(),
            username: username.toLowerCase(),
            firstName: firstName,
            dateOfBirth: dateOfBirth,
            password: hashedPassword
        })
            .then(user => {
                // Creating JWT token
                const payload = {
                    user: {
                        id: user.id
                    }
                };
                const authToken = jwt.sign(payload, JWT_SECRET);

                // Sending response
                res.status(201).json({ auth_token: authToken });
            })
            .catch(e => {
                if (e.keyValue.hasOwnProperty('email'))
                    res.status(400).json({ "errors": [{path: "email", message: "duplicate" }] })
                else if (e.keyValue.hasOwnProperty('username'))
                    res.status(400).json({ "errors": [{path: "username", message: "duplicate" }] })
            })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal server error" });
    }
});

router.post('/login', [
    body('username', 'at least 5 characters required').isLength({ min: 5 }),
    body('password', 'at least 4 characters required').isLength({ min: 4 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array().map(error => {
                return { path: error.path, message: error.msg }
            })
        });
    }

    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username: username.toLowerCase() });

        if (!user) {
            return res.status(400).json({ path: "username", message: 'invalid' });
        }

        // Compare passwords using bcrypt.compare()
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                throw err; // Handle the error
            }
            if (isMatch) {
                const payload = {
                    user: {
                        id: user.id
                    }
                };
                const authToken = jwt.sign(payload, JWT_SECRET);
                res.status(200).json({ auth_token: authToken });
            } else {
                res.status(400).json({ path: "password", message: 'invalid' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "internal server error" });;
    }
});

module.exports = router