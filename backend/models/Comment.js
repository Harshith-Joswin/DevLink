const mongoose = require('mongoose')
const { Schema } = mongoose;
const User = require('./User');
const Post = require('./Post');

// Schema for comment table
const CommentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    content: {
        type:String,
        required:true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    }
});

// Middleware to update commentsCount when a new comment is added
CommentSchema.post('save', async function (doc) {
    try {
        if (doc.post) {
            const Post = mongoose.model('post');
            const post = await Post.findById(doc.post);
            if (post) {
                post.commentsCount += 1;
                await post.save();
            }
        }
    } catch (error) {
        console.error("Error updating likesCount:", error);
    }
});

// Middleware to update commentsCount when a new comment is deleted
CommentSchema.post('findOneAndDelete', async function (doc) {
    try {
        if (doc.post) {
            const Post = mongoose.model('post');
            const post = await Post.findById(doc.post);
            if (post) {
                post.commentsCount -= 1;
                await post.save();
            }
        }
    } catch (error) {
        console.error("Error updating likesCount:", error);
    }
});

module.exports = mongoose.model('comment', CommentSchema);