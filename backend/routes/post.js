const express = require('express');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const fetchUser = require("../middlewares/fetchUser");
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Like = require('../models/Like');
const Follow = require('../models/Follow');
const Bid = require('../models/Bid');

const router = express.Router();


const STORAGE_URL = process.env.STORAGE_URL;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${STORAGE_URL}/posts/photos`);
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + '-' + Math.random() * 1e16 + Date.now() + path.extname(file.originalname));
            
    }
});

// Multer middleware for uploading files
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const fileName = path.extname(file.originalname);
            const folder = (file.mimetype === 'application/pdf' || file.mimetype === 'application/msword' || file.mimetype === 'application/vnd.ms-excel' || file.mimetype === 'application/vnd.ms-excel') ? "documents" : "photos";
            cb(null, path.join(STORAGE_URL, `posts/${folder}`));
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + '-' + Math.random() * 1e16 + Date.now() + path.extname(file.originalname));
        }
    }),
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/bmp' || file.mimetype === 'application/pdf' || file.mimetype === 'application/msword' || file.mimetype === 'application/vnd.ms-excel' || file.mimetype === 'application/vnd.ms-excel') {
            cb(null, true);
        } else {
            cb(new Error('Invalid file format. Only JPEG, BMP and PNG files are allowed.'));
        }
    },
    limits: { fileSize: 10 * 1024 * 1024 }
});

// Contains subroutes for '/api/profile/' route

// Function to create a post
router.post('/create', fetchUser, upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'documents', maxCount: 10 }
]), [
    body('title').isLength({ min: 3 }).withMessage('at least 3 characters required'),
    body('description').isLength({ min: 5 }).withMessage('at least 5 characters required'),
    body('budget').isNumeric().withMessage('must be a number'),
    body('biddingEndDate').isDate().withMessage('must be a date'),
    body('projectEndDate').isDate().withMessage('must be a date')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(400).json({
            errors: errors.array().map(error => {
                return { path: error.path, message: error.msg };
            })
        });
    }
    try {

        User.findById(req.user.id)
            .then(user => {
                let { title, description, platforms, technologies, budget, biddingEndDate, projectEndDate } = req.body;
                let imagesURL;
                if (req.files.images)
                    imagesURL = req.files.images.map(file => {
                        return file.filename;
                    });
                let documentsURL
                if (req.files.documents)
                    documentsURL = req.files.documents.map(file => {
                        return file.filename;
                    });
                Post.create({ user: user, title, description, platforms, technologies, budget, biddingEndDate, projectEndDate, imagesURL, documentsURL })
                    .then(post => {
                        let { _id, title, description, platforms, technologies, budget, biddingEndDate, projectEndDate, imagesURL, documentsURL, likesCount, commentsCount } = post;
                        res.json({ id: _id, title, description, platforms, technologies, budget, biddingEndDate, projectEndDate, imagesURL, documentsURL, likesCount, commentsCount, liked: false });

                    })
                    .catch(e => {
                        console.log(e);
                        res.json({ message: "failed to create new post" })
                    })
            })
            .catch(e => {
                console.log(e);
                return res.status(404).json({ message: "user not found" });
            })
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "internal server error" });
    }

});

// Functionn to retrive the post details using postId
router.post('/get/:postId', fetchUser, async (req, res) => {
    Post.findById(req.params.postId)
        .then(async post => {
            const like = await Like.findOne({ user: req.user.id, post: req.params.postId });
            const { _id, title, description, platforms, technologies, budget, biddingEndDate, projectEndDate, imagesURL, documentsURL, likesCount, commentsCount } = post;
            let topBid = await getBids(req.params.postId, 1, 1)
            return res.json({ id: _id, title, description, platforms, technologies, budget, biddingEndDate, projectEndDate, imagesURL, documentsURL, likesCount, commentsCount, liked: like ? true : false, topBid: (topBid ? topBid.amount : post.budget) })
        })
        .catch(error => {
            console.log(error);
            return res.status(404).json({ message: "post not found" });
        });
});

// To retrieve the photos of the post using filename
router.get('/photo/:filename', (req, res) => {
    const filePath = path.join(STORAGE_URL, "posts/photos/" + req.params.filename);
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

// Function to retrieve the document file using filename
router.get('/document/:filename', (req, res) => {
    const filePath = path.join(STORAGE_URL, "posts/documents/" + req.params.filename);
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

// Function to update the post using postId
router.post('/update/:postId', fetchUser, upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'documents', maxCount: 10 }
]), [
    body('title').optional().isLength({ min: 3 }).withMessage('at least 3 characters required'),
    body('description').optional().isLength({ min: 5 }).withMessage('at least 5 characters required'),
    body('budget').isNumeric().optional().withMessage('must be a number'),
    body('biddingEndDate').optional().isDate().withMessage('must be a date'),
    body('projectEndDate').optional().isDate().withMessage('must be a date')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(400).json({
            errors: errors.array().map(error => {
                return { path: error.path, message: error.msg };
            })
        });
    }
    try {
        Post.findById(req.params.postId)
            .then(post => {
                if (post.user.toString() !== req.user.id) {
                    return res.status(401).json({ message: "unauthorized user" });
                }
                const prevImagesURL = post.imagesURL;
                const prevDocumentsURL = post.documentsURL;
                const newData = {};
                const { title, description, platforms, technologies, budget, biddingEndDate, projectEndDate } = req.body;
                if (title) newData.title = title;
                if (platforms.length != 0) newData.platforms = platforms;
                if (technologies.length != 0) newData.technologies = technologies;
                if (description) newData.description = description;
                if (budget) newData.budget = budget;
                if (biddingEndDate) newData.biddingEndDate = biddingEndDate;
                if (projectEndDate) newData.projectEndDate = projectEndDate;
                if (req.files.images) {
                    newData.imagesURL = req.files.images.map(file => {
                        return file.filename;
                    });

                }
                if (req.files.documents) {
                    newData.documentsURL = req.files.documents.map(file => {
                        return file.filename;
                    });
                }
                Post.findOneAndUpdate({ _id: req.params.postId }, { $set: newData })
                    .then(async post => {
                        if (req.files.images) {
                            for (let i = 0; i < prevImagesURL.length; i++) {
                                const filePath = path.join(STORAGE_URL, "posts/photos/" + prevImagesURL[i]);
                                try {
                                    await fs.promises.access(filePath, fs.constants.F_OK);
                                    await fs.promises.unlink(filePath);
                                } catch (err) {
                                    console.log("Error deleting image:", err);
                                }
                            }
                            newData.imagesURL = req.files.images.map(file => {
                                return file.filename;
                            });
                        }


                        if (req.files.documents) {
                            for (let i = 0; i < prevDocumentsURL.length; i++) {
                                const filePath = path.join(STORAGE_URL, "posts/documents/", prevDocumentsURL[i]);
                                try {
                                    await fs.promises.access(filePath, fs.constants.F_OK);
                                    await fs.promises.unlink(filePath);
                                } catch (err) {
                                    console.log("Error deleting document:", err);
                                }
                            }
                            newData.documentsURL = req.files.documents.map(file => {
                                return file.filename;
                            });
                        }

                        if (req.files.documents) {
                            const prevdocumentsURL = post.documentsURL;
                            for (let i = 0; i < post.documentsURL.length; i++) {
                                const filePath = path.join(STORAGE_URL, "posts/documents/" + post.documentsURL[i]);
                                fs.access(filePath, fs.constants.F_OK, (err) => {
                                    if (!err) {
                                        fs.unlink(filePath, (err) => {
                                            if (err)
                                                console.log("File can not be deleted", err);
                                        });
                                    }
                                });
                            }
                            newData.documentsURL = req.files.documents.map(file => {
                                return file.filename;
                            });
                        }

                        const like = await Like.findOne({ user: req.user.id, post: req.params.postId });
                        let { _id, title, description, platforms, technologies, budget, biddingEndDate, projectEndDate, imagesURL, documentsURL, likesCount, commentsCount } = post;
                        res.json({ id: _id, title, description, platforms, technologies, budget, biddingEndDate, projectEndDate, imagesURL, documentsURL, likesCount, commentsCount, liked: like ? true : false });

                    })
                    .catch(e => {
                        console.log(e);
                        res.json({ message: "failed to create new post" })
                    });

            })
            .catch(e => {
                console.log(e);
                return res.status(404).json({ message: "user not found" });
            })
    } catch (e) {
        console.log(e);
        res.staatus(500).json({ message: "internal server error" });
    }

});



router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Contains routes for comments

// Function to create comments for a given post
router.post('/:postId/comment/create', fetchUser,
    [body('content').notEmpty().withMessage('required')], (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors);
            return res.status(400).json({
                errors: errors.array().map(error => {
                    return { path: error.path, message: error.msg };
                })
            });
        }
        Post.findById(req.params.postId)
            .then(post => {
                const newComment = { user: req.user.id, post: post._id, content: req.body.content }
                Comment.create(newComment)
                    .then(comment => {
                        return res.json({ id: comment._id, user: comment.user, post: comment.post, content: comment.content });
                    })
                    .catch(error => {
                        console.log(error);
                        return res.status(500).json({ message: "Internal server error" });
                    })
            })
            .catch(error => {
                console.log(error);
                return res.status(404).json({ message: "post not found" });
            });
    });

    // Function to delete comments for a given post
router.delete('/comment/:commentId', fetchUser, (req, res) => {
    Comment.findById(req.params.commentId)
        .then(comment => {
            if (req.user.id == comment.user.toString()) {
                Comment.findOneAndDelete({_id:req.params.commentId})
                    .then(comment => {
                        return res.json({ message: "comment deleted successfully" });
                    })
                    .catch(error => {
                        return res.json({ message: "comment could not be deleted" });
                    })
            }
            else{
                return res.status(401).json({message: "user not authorized"})
            }
        })
        .catch(error => {
            console.log(error);
            return res.status(404).json({ message: "Comment not found" })
        })
});

// Function to retrieve comments
async function getComments(postId, page, limit) {
    postId = new mongoose.Types.ObjectId(postId);
    try {
        const post = await Post.findById(postId);
        skip = (page - 1) * limit;
        const totalCount = (await Comment.find({post:postId})).length;

        let comments = [];


        if (totalCount > (page - 1) * limit) {

            comments = await Comment.aggregate([
                {
                    $match: {
                        post: postId
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "user",
                        foreignField: "_id",
                        as: "userDetails"
                    }
                },
                {
                    $unwind: "$userDetails"
                },
                {
                    $project: {
                        _id: 1,
                        createdAt: 1,
                        amount: 1,
                        "user._id": "$userDetails._id",
                        "user.username": "$userDetails.username",
                        "user.firstName": "$userDetails.firstName",
                        "user.lastName": "$userDetails.lastName",
                        "user.profilePhotoURL": "$userDetails.profilePhotoURL",
                        content: 1
                    }
                },
                {
                    $limit: limit
                },
                {
                    $skip: skip
                },
                {
                    $sort: { createdAt: -1 }
                }
            ]);

        }
        return comments;
    } catch (error) {
        console.error("Error fetching Comments:", error);
        throw error;
    }
}

// Function to fetch comments from the given post
router.post('/:postId/comment', async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        let page = parseInt(req.query.page);
        let limit = parseInt(req.query.limit);

        if (page < 0) {
            return res.status(400).json({ message: "invalid page number" });
        }
        else if (limit < 0) {
            return res.status(400).json({ message: "invalid limit" });
        }

        getComments(req.params.postId, page, limit)
            .then(comments => {
                let result = { count: comments.length };
                if (page > 1) {
                    result.previous = {
                        page: page - 1,
                        limit: limit
                    }
                }
                if (comments.length == limit) {
                    result.next = {
                        page: page + 1,
                        limit: limit
                    };
                }

                result.comments = comments;

                res.json(result)
            })
            .catch(error => {
                // Handle any errors
                console.error("Error:", error);
            });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Function to fetch like of a given post
router.post('/:postId/like', fetchUser, async (req, res) => {
    const like = await Like.findOne({ user: req.user.id, post: req.params.postId });
    if (!like) {
        Like.create({ user: req.user.id, post: req.params.postId })
            .then(like => {
                if (like) {
                    return res.json({ liked: true, message: "Like added successfully" });
                }
                else
                    return res.json({ liked: false, message: "Failed to add like" });

            })
            .catch(e => {
                console.log(e);
                return res.json({ liked: false, message: "Failed to add like" });
            })
    }
    else {
        Like.findOneAndDelete({ user: req.user.id, post: req.params.postId })
            .then(like => {
                if (like) {
                    return res.json({ liked: false, message: "Like deleted successfully" });
                }
                else
                    return res.json({ liked: true, message: "Failed to delete like" });

            })
            .catch(e => {
                console.log(e);
                return res.json({ liked: true, message: "Failed to delete like" });
            })
    }

});

async function recommendedPosts(userId, page, limit) {
    try {
        const user = await User.findById(userId);
        // Get the interested platforms and technologies of the user
        const userPlatforms = user.interestedPlatforms.map(platform => platform.platform);
        const userTechnologies = user.interestedTechnologies.map(tech => tech.technology);
        const followingUsers = (await Follow.find({ follower: user._id })).map(follow => follow.following);
        let skip = (page - 1) * limit;

        const likedPosts = (await Like.find({user:userId})).map(like => like.post);
        const daysDiff = ((new Date()).getDate() - 5);
        
        const totalCount = await Post.aggregate([
            {
                $match: {
                    $and: [
                        { user: { $in: followingUsers } },
                        // { createdAt: { $gte: daysDiff } },
                        { isHandovered: { $ne: true } }
                    ]
                }
            },
            {
                $count: "total"
            }
        ]);
        let followingPosts = [];

        if (totalCount.length > (page - 1) * limit) {
            followingPosts = await Post.aggregate([
                // Match posts with at least one matching platform or technology
                {
                    $match: {
                        $and: [
                            {
                                user: { $in: followingUsers }
                            },
                            // {
                            //     createdAt: { $gte: daysDiff }
                            // },
                            { isHandovered: { $ne: true } }
                        ]
                    }
                },
                {
                    $limit: limit
                },
                {
                    $skip: skip
                },
                {
                    $project: {
                        _id: 1,
                        user: 1,
                        createdAt: 1,
                        title: 1,
                        description:1,
                        platforms: 1,
                        technologies: 1,
                        budget: 1,
                        biddingEndDate: 1,
                        imagesURL: 1,
                        documentsURL:1,
                        likesCount: 1,
                        commentsCount: 1,
                        isLiked: { $in: ["$_id", likedPosts] }
                    }
                },
                {
                    $sort: { createdAt: -1 }
                }
            ]);

        }


        let similarPosts = [];
        if (page * limit > totalCount.length) {
            skip = (page -1)* limit - totalCount.length;
            limit -= followingPosts.length;

            if(skip>=0)
            similarPosts = await Post.aggregate([
                // Match posts with at least one matching platform or technology
                {
                    $match: {
                        $and: [
                            {
                                $or: [
                                    { platforms: { $in: userPlatforms } },
                                    { technologies: { $in: userTechnologies } }
                                ]
                            },
                            { user: { $ne: user._id } } // Exclude posts uploaded by a current user
                            , { isHandovered: { $ne: true } },
                            { use: { $ne: followingUsers } }
                        ]
                    }
                },
                // Project to include the total score of each post
                {
                    $project: {
                        _id: 1,
                        user: 1,
                        createdAt: 1,
                        title: 1,
                        description:1,
                        platforms: 1,
                        technologies: 1,
                        budget: 1,
                        biddingEndDate: 1,
                        imagesURL: 1,
                        documentsURL:1,
                        likesCount: 1,
                        commentsCount: 1,
                        isLiked: { $in: ["$_id", likedPosts] },
                        totalScore: {
                            $add: [
                                {
                                    $sum: {
                                        $map: {
                                            input: user.interestedTechnologies,
                                            as: "tech",
                                            in: {
                                                $cond: [{ $in: ["$$tech.technology", "$technologies"] }, "$$tech.score", 0]
                                            }
                                        }
                                    }
                                },
                                {
                                    $sum: {
                                        $map: {
                                            input: user.interestedPlatforms,
                                            as: "platforms",
                                            in: {
                                                $cond: [{ $in: ["$$platforms.platform", "$platforms"] }, "$$platforms.score", 0]
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    }
                },
                // Sort the posts based on totalScore in descending order
                {
                    $sort: { totalScore: -1 }
                },
                {
                    $skip: skip
                },
                {
                    $limit: limit
                }
            ]);
        }

        let posts = followingPosts.concat(similarPosts);

        let otherPosts = [];

        if(limit>posts.length){
            skip = (page-1)*limit + posts.length;
            otherPosts = await Post.aggregate([
                // Match posts with at least one matching platform or technology
                {
                    $match: {
                        $and: [
                            {
                                $nor: [
                                    { platforms: { $in: userPlatforms } },
                                    { technologies: { $in: userTechnologies } }
                                ]
                            },
                            { user: { $ne: user._id } } // Exclude posts uploaded by a current user
                            , { isHandovered: { $ne: true } },
                            { use: { $ne: followingUsers } }                            
                        ]
                    }
                },
                // Project to include the total score of each post
                {
                    $project: {
                        _id: 1,
                        user: 1,
                        createdAt: 1,
                        title: 1,
                        description:1,
                        platforms: 1,
                        technologies: 1,
                        budget: 1,
                        biddingEndDate: 1,
                        imagesURL: 1,
                        documentsURL:1,
                        likesCount: 1,
                        commentsCount: 1,
                        isLiked: { $in: ["$_id", likedPosts] },
                        totalScore: {
                            $add: [
                                {
                                    $sum: {
                                        $map: {
                                            input: user.interestedTechnologies,
                                            as: "tech",
                                            in: {
                                                $cond: [{ $in: ["$$tech.technology", "$technologies"] }, "$$tech.score", 0]
                                            }
                                        }
                                    }
                                },
                                {
                                    $sum: {
                                        $map: {
                                            input: user.interestedPlatforms,
                                            as: "platforms",
                                            in: {
                                                $cond: [{ $in: ["$$platforms.platform", "$platforms"] }, "$$platforms.score", 0]
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    }
                },
                // Sort the posts based on totalScore in descending order
                {
                    $sort: { totalScore: -1 }
                },
                {
                    $skip: skip
                },
                {
                    $limit: limit
                }
            ]);
        }
        return posts.concat(otherPosts);
    } catch (error) {
        console.error("Error fetching similar posts:", error);
        throw error;
    }
}

// Function to retrieve post/feed data
router.post('/', fetchUser, async (req, res) => {
    try {
        let page = parseInt(req.query.page);
        let limit = parseInt(req.query.limit);

        if (page < 0) {
            return res.status(400).json({ message: "invalid page number" });
        }
        else if (limit < 0) {
            return res.status(400).json({ message: "invalid limit" });
        }

        recommendedPosts(req.user.id, page, limit)
            .then(async posts => {
                let result = { count: posts.length };
                if (page > 1) {
                    result.previous = {
                        page: page - 1,
                        limit: limit
                    }
                }
                if (posts.length == limit) {
                    result.next = {
                        page: page + 1,
                        limit: limit
                    };
                }
                let temp = [];

                for (const post of posts) {
                    const topBid = await getBids(post._id, 1, 1);
                    post.topBid = topBid.amount;
                    temp.push(post);
                }


                result.posts = temp;

                res.json(result)
            })
            .catch(error => {
                // Handle any errors
                console.error("Error:", error);
            });
    }
    catch (e) {
        console.log("Error while sending recommended posts: ",e);
        return res.status(500).json({ message: "Internal server Error" });
    }
});

// Function to retrieve post uploaded by the user themselves
//get posts uploaded by the user
router.post('/myposts', fetchUser, async (req, res)=>{
    try {
        const posts = await Post.find({ user: req.user.id });
        return res.json({ posts });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});


//Bidding
// Function to bid to a post 
router.post('/:postId/bid/create', fetchUser, [
    body('amount').isNumeric().withMessage('must be a number'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(400).json({
            errors: errors.array().map(error => {
                return { path: error.path, message: error.msg };
            })
        });
    }
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const postedUser = User.findById(post.user)
        if (req.user.id == postedUser) {
            return res.status(401).json({ message: "Bidding not allowed" });
        }

        if (await Bid.findOne({ user: req.user.id, post: post._id })) {
            return res.status(401).json({ message: "Bidding already done" });
        }

        Bid.create({ user: req.user.id, post: post._id, amount: req.body.amount })
            .then(bid => {
                return res.json(bid._id, bid.user, bid.post, bid.amount);
            })
            .catch(e => {
                console.log(e);
                return res.status(400).json({ message: "Failed to create bid" })
            })


    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Internal server error" })
    }
});

// Function to delete a bid
router.delete('/bid/:bidId', fetchUser, async (req, res) => {
    try {
        const bid = await Bid.findById(req.params.bidId)
        if (!bid) {
            return res.status(404).json({ message: "Bidding not found" });
        }
        else if (toString(bid.user) != toString(req.user.id)) {
            return res.status(403).json({ message: "deletion is forbidden" })
        }
        else {
            Bid.findByIdAndDelete(bid._id)
                .then(deletedBid => {
                    return res.json({ message: "Bid deleted successfully", id: deletedBid._id, user: deletedBid.user, post: deletedBid.post, amount: deletedBid.amount });
                })
                .catch(e => {
                    console.log(e);
                    return res.status(304).json({ message: "Could not delete the Bid" })
                })
        }
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Internal server error" })
    }
});

// Function to retrieve bid
router.post('/:postId/bids', async (req, res) => {
    try {
        let page = parseInt(req.query.page);
        let limit = parseInt(req.query.limit);
        if (page < 0) {
            return res.status(400).json({ message: "invalid page number" });
        }
        else if (limit < 0) {
            return res.status(400).json({ message: "invalid limit" });
        }

        getBids(req.params.postId, page, limit)
            .then(bids => {
                let result = { count: bids.length };
                if (page > 1) {
                    result.previous = {
                        page: page - 1,
                        limit: limit
                    }
                }
                if (bids.length == limit) {
                    result.next = {
                        page: page + 1,
                        limit: limit
                    };
                }

                result.bids = bids;

                res.json(result)
            })
            .catch(error => {
                // Handle any errors
                console.error("Error:", error);
            });
    }
    catch (e) {

    }
});

async function getBids(postId, page, limit) {
    try {
        postId = new mongoose.Types.ObjectId(postId);
        const post = await Post.findById(postId);
        skip = (page - 1) * limit;

        const totalCount = await Bid.aggregate([
            {
                $match:
                    { post: postId }
            },
            {
                $count: "total"
            }
        ]);


        let bids = [];

        if (totalCount.length > (page - 1) * limit) {
            bids = await Bid.aggregate([
                {
                    $match: {
                        post: postId
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "user",
                        foreignField: "_id",
                        as: "userDetails"
                    }
                },
                {
                    $unwind: "$userDetails"
                },
                {
                    $project: {
                        _id: 1,
                        createdAt: 1,
                        amount: 1,
                        "user._id": "$userDetails._id",
                        "user.username": "$userDetails.username",
                        "user.firstName": "$userDetails.firstName",
                        "user.lastName": "$userDetails.lastName",
                        "user.profilePhotoURL": "$userDetails.profilePhotoURL"
                    }
                },
                {
                    $limit: limit
                },
                {
                    $skip: skip
                },
                {
                    $sort: { amount: -1 }
                }
            ]);

        }
        return bids;
    } catch (error) {
        console.error("Error fetching bids:", error);
        throw error;
    }
}




async function acceptedPosts(userId, page, limit) {
    try {
        const user = await User.findById(userId);
        let skip = (page - 1) * limit;

        const likedPosts = (await Like.find({user:userId})).map(like => like.post);
        
       
            followingPosts = await Post.aggregate([
                // Match posts with at least one matching platform or technology
                {
                    $match: { developer: user._id}
                },
                {
                    $limit: limit
                },
                {
                    $skip: skip
                },
                {
                    $project: {
                        _id: 1,
                        user: 1,
                        createdAt: 1,
                        title: 1,
                        description:1,
                        platforms: 1,
                        technologies: 1,
                        budget: 1,
                        biddingEndDate: 1,
                        imagesURL: 1,
                        documentsURL:1,
                        likesCount: 1,
                        commentsCount: 1,
                        isHandovered:1,
                        isCompleted:1,
                        isLiked: { $in: ["$_id", likedPosts] }
                    }
                },
                {
                    $sort: { projectEndDate: 1 }
                }
            ]);





        return followingPosts;
    } catch (error) {
        console.error("Error fetching accepted posts:", error);
        throw error;
    }
}

// Function to retrieve accepted posts
router.post('/accepted', fetchUser, async (req, res) => {
    try {
        let page = parseInt(req.query.page);
        let limit = parseInt(req.query.limit);
        if (page < 0) {
            return res.status(400).json({ message: "invalid page number" });
        }
        else if (limit < 0) {
            return res.status(400).json({ message: "invalid limit" });
        }

        acceptedPosts(req.user.id, page, limit)
            .then(async posts => {
                let result = { count: posts.length };
                if (page > 1) {
                    result.previous = {
                        page: page - 1,
                        limit: limit
                    }
                }
                if (posts.length == limit) {
                    result.next = {
                        page: page + 1,
                        limit: limit
                    };
                }
                let temp = [];

                for (const post of posts) {
                    const topBid = await getBids(post._id, 1, 1);
                    post.topBid = topBid.amount;
                    temp.push(post);
                }


                result.posts = temp;

                res.json(result)
            })
            .catch(error => {
                // Handle any errors
                console.error("Error:", error);
            });
    }
    catch (e) {
        console.log("Error while sending accepted posts: ",e);
        return res.status(500).json({ message: "Internal server Error" });
    }
})

//error handling code
router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
    } else if (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error', msg: err });
    }
});

module.exports = router