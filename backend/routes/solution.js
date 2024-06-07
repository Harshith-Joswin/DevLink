const express = require('express');
const fetchUser = require('../middlewares/fetchUser');
const Post = require('../models/Post');
const Notification = require('../models/Notification');
const Solution = require('../models/Solution');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Contains sub routes for './routes/solution'

const STORAGE_URL = process.env.STORAGE_URL;

// Multer middleware for uploading files
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `${STORAGE_URL}/solutions`);
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + '-' + Math.random() * 1e16 + Date.now() + path.extname(file.originalname));
        }
    }),
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/zip' || file.mimetype === 'application/x-rar-compressed' || file.mimetype === 'application/x-7z-compressed') {
            // Accept the file
            cb(null, true);
        } else {
            // Reject the file with an error message
            cb(new Error('Only compressed files (zip, rar, 7z) are allowed'));
        }
    },
    limits: { fileSize: 10000 * 1024 * 1024 }
});

// Function to upload solution for a given post
router.post('/upload/:postId', fetchUser, upload.single('solution'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "Source file required" })
    }

    const post = await Post.findById(req.params.postId);

    if(!post){
        return res.status(404).json({message: "Post not found"})
    }

    if(post.isCompleted){
        return res.status(400).json({message: "Source can be uploaded only once"})
    }

    if (toString(req.user.id) != toString(post.developer)) {
        const filePath = path.join(STORAGE_URL, "solutions/" + req.file.filename); // Adjust the path as per your file storage location
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (!err) {
                fs.unlink(filePath, (err) => {
                    if (err)
                        console.log("File can not be deleted", err);
                });
            }
        });
        return res.status(403).json({ message: "Unauthorized user" });
    }

    const sol = await Solution.findOne({post: req.params.postId});

    if(sol){
        await Solution.findByIdAndUpdate(sol._id, {sourceURL: req.file.filename});
    }
    else{
    Solution.create({ developer: post.developer, post: req.params.postId, sourceURL: req.file.filename })
        .then(async solution => {
            await Post.findByIdAndUpdate(req.params.postId, { solution: solution._id, isCompleted: true });
            await Notification.create({user:post.user, link:solution._id, notificationType:"PROJECT_COMPLETED_POSTER", message:`Project is completed. project: ${post.title}. You can now download the solution.`});
        });
    }
    return res.json({ message: "Solution uploaded successfully" });
});

// Function to  download solution uploaded by the developer for a given post
router.get('/download/:postId', fetchUser, async (req, res) => {
    const post = await Post.findById(req.params.postId);
    const solution = await Solution.findById(post.solution);
    if(!solution){
        return res.status(404).json({message: "solution not found"})
    }

    if(toString(req.user.id) != toString(post.user)){
        return res.status(403).json({ message: "Unauthorized user" });
    }

    const filename = solution.sourceURL;
    const filePath = path.join(STORAGE_URL, "solutions/" +filename);
    fs.access(filePath, fs.constants.F_OK, async (err) => {
        if (!err) {
            const note = await Notification.findOne({link:solution._id, user:post.developer});
            if(!note)
            await Notification.create({user:post.developer, link:solution._id, notificationType:"SOLUTION_DOWNLOADED_DEVELOPER", message:`Solution is downloaded by the poster. project: ${post.title}.`});
            res.sendFile(filePath);
        }
        else {
            console.log(err);
            res.status(404).json({ error: "File Not found" })
        }
    });
});

module.exports = router
