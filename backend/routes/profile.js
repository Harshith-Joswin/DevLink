const express = require('express')
const { body, validationResult } = require('express-validator')
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const fetchUser = require("../middlewares/fetchUser")
const User = require('../models/User');
const Follow = require('../models/Follow');

const router = express.Router();

const bodyParser = require('body-parser');
router.use(bodyParser.json());
const STORAGE_URL = process.env.STORAGE_URL;

//fetch users own profile details
const getUser = async (req, res) => {
    User.findById(req.user.id)
        .then(user => {
            const { _id, username, email, firstName, lastName, dateOfBirth, skills, occupation, bio, profilePhotoURL } = user;
            return res.status(200).json({ _id, username, email, firstName, lastName, dateOfBirth, skills, occupation, bio, profilePhotoURL })
        })
        .catch(error => {
            console.log(error);
            return res.status(401).json({ message: "user not found" });
        });
}

//fetch users own profile details
router.post('/', fetchUser, getUser);


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(STORAGE_URL, "profiles"));
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Math.random() * 1e16 + Date.now() + path.extname(file.originalname));
    }
});

// File filter function to check file format
const fileFilter = function (req, file, cb) {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/bmp') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file format. Only JPEG, BMP and PNG files are allowed.'));
    }
};

// Initialize multer upload with configured options
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

//login required
//update user's profile details
router.post('/update', fetchUser, upload.single('profile'),
    [
        body('firstName').optional().isLength({ min: 3 }).withMessage('at least 3 characters required'),
        body('username').optional().isLength({ min: 5 }).withMessage('at least 5 characters required'),
        body('newPassword').optional()
            .isLength({ min: 8 }).withMessage('at least 8 characters required')
            .matches(/[A-Z]/).withMessage('must contain at least one uppercase letter')
            .matches(/[a-z]/).withMessage('must contain at least one lowercase letter')
            .matches(/[0-9]/).withMessage('must contain at least one number')
            .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/).withMessage('must contain at least one special character'),
        body('email').optional().isEmail().withMessage('invalid'),
        body('dateOfBirth').optional().isDate().withMessage('required')
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {

            //if any field is invalid but new profile photo is stored, then delete it  
            if (req.file) {
            const filePath = path.join(STORAGE_URL, "profiles/" + req.file.filename); // Adjust the path as per your file storage location
            fs.access(filePath, fs.constants.F_OK, (err) => {
                if (!err) {
                    fs.unlink(filePath, (err) => {
                        if (err)
                            console.log("File can not be deleted", err);
                    });
                }
            });
        }
            return res.status(400).json({
                errors: errors.array().map(error => {
                    return { path: error.path, message: error.msg }
                })
            });
        }
        try {
            const { username, email, firstName, lastName, dateOfBirth, skills, occupation, bio, currentPassword, newPassword } = req.body;
            const newData = {};
            if (username) newData.username = username;
            if (email) newData.email = email;
            if (firstName) newData.firstName = firstName;
            if (lastName) newData.lastName = lastName;
            if (dateOfBirth) newData.dateOfBirth = dateOfBirth;
            if (skills) newData.skills = skills;
            if (occupation) newData.occupation = occupation;
            if (bio) newData.bio = bio;
            if (currentPassword || newPassword) {
                if (currentPassword && newPassword) {
                    const user = await User.findById(req.user.id);
                    try {
                        const isMatch = await bcrypt.compare(currentPassword, user.password);
                        if (isMatch) {
                            const salt = await bcrypt.genSalt(10);
                            const hashedPassword = await bcrypt.hash(newPassword, salt);
                            newData.password = hashedPassword;
                        } else {
                            return res.status(400).json({ path: "password", message: 'not matched' });
                        }
                    } catch (err) {
                        console.log(err);
                        return res.status(500).json({ message: "Internal server error" });
                    }
                } else {
                    return res.status(400).json({ path: "password", message: 'both newPassword and currentPasswords are required' });
                }
            }
            User.findByIdAndUpdate(req.user.id, { $set: newData })
                .then(async updatedUser => {
                    try {
                        if ((!req.file && updatedUser.profilePhotoURL) || req.file) {
                            const profilePhotoURL = req.file ? req.file.filename : '';
                            const prevProfileURL = updatedUser.profilePhotoURL;
                            await User.findByIdAndUpdate(req.user.id, { $set: { profilePhotoURL: profilePhotoURL } })
                                .then(tmp => {
                                    if (prevProfileURL) {
                                        const filePath = path.join(STORAGE_URL, "profiles/" + prevProfileURL); // Adjust the path as per your file storage location
                                        // Check if the file exists
                                        fs.access(filePath, fs.constants.F_OK, (err) => {
                                            if (!err) {
                                                fs.unlink(filePath, (err) => {
                                                    if (err)
                                                        console.log("File can not be deleted", err);
                                                });
                                            }
                                        });
                                    }
                                })
                                .catch(err => {
                                    console.log("Cannot update profileURL", err);
                                    return res.status(500).json({ message: 'Failed to update user.', error: err });
                                })

                            return res.json({ msg: "updated successfully" })//getUser(req, res); // Send the updated user object in the response

                        }
                        else{
                            return res.json({ msg: "updated successfully", updatedUser })
                        }

                    }
                    catch (err) {
                        console.log(err);
                    }
                })
                .catch(err => {
                    return res.status(500).json({ message: 'Failed to update user.', error: err });
                });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: "error" });

        }
    });

//fetch any user's profile photo
router.get('/photo/:filename', (req, res) => {
    const filePath = path.join(STORAGE_URL, "/profiles/" + req.params.filename);
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (!err) {
            res.sendFile(filePath);
        }
        else {
            console.log(err);
            res.status(404).json({ error: "File Not found" })
        }
    });
});

//Handle follow feature
router.post('/:userId/follow', fetchUser, async (req, res) => {
    if (req.user.id.toString() != req.params.userId) {
        const following = await Follow.findOne({ following: req.params.userId, follower: req.user.id });
        if (!following) {
            let user = await User.findById(req.params.userId);
            if (user)
                Follow.create({ following: user._id, follower: req.user.id })
                    .then(follow => {
                        return res.json({ message: "Following..." })
                    })
                    .catch(e => {
                        console.log(e);
                        return res.json({ error: "Unable to follow" })
                    });
            else
                return res.json({ message: "user doesnot exist" });
        }
        else {
            return res.json({ message: "Following..." })
        }
    }
    else
        return res.json({ message: "Cannot follow self" })

})

//unfollow
router.post('/:userId/unfollow', fetchUser, async (req, res) => {
    if (req.user.id.toString() != req.params.userId) {
        const following = await Follow.findOne({ following: req.params.userId, follower: req.user.id });
        if (following) {
            Follow.findOneAndDelete({ following: req.params.userId, follower: req.user.id })
                .then(follow => {
                    return res.json({ message: "Unfollowed..." })
                })
                .catch(e => {
                    console.log(e);
                    return res.json({ error: "Unable to Unfollow" })
                })
        }
        else {
            return res.json({ message: "Unfollowed..." })
        }
    }
    else
        return res.json({ message: "Cannot Unfollow self" })

})

//any user's full profile details
router.post('/:userid', (req, res) => {
    User.findById(req.params.userid)
        .then(user => {
            const { _id, username, firstName, lastName, profilePhotoURL, skills, occupation, bio } = user;
            return res.status(200).json({ id: _id, username, firstName, lastName, skills, occupation, bio, profilePhotoURL })
        })
        .catch(error => {
            console.log(error);
            return res.status(401).json({ message: "user not found" });
        });
});


//error handling
router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
    } else if (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error', msg: err });
    }
});


module.exports = router