const mongoose = require('mongoose')
const { Schema } = mongoose;
const User = require('./User');

// Schema for Post table
const PostSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User", // Reference the User model
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    },
    last_modified: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        required: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        maxlength: 1000
    },
    platforms: [{
        type: String,
        default: ""
    }],
    technologies: [{
        type: String,
        default: ""
    }],
    budget: {
        type: Number,
        required: true
    },




    biddingEndDate: {
        type: Date,        
        required: true
    },
    isHandovered: {
        type: Boolean,
        default: false
    },
    cost: {
        type: Number
    },
    developer: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    bid: {
        type:Schema.Types.ObjectId,
        ref: "Bid"
    },



    projectEndDate: {
        type: Date,        
        required: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    },     
    isNotified: {
        type: Boolean,
        default: false
    },  
    solution: {
        type:Schema.Types.ObjectId,
        ref: "Solution"
    },



    imagesURL: [{
        type: String,
        default:""
    }],
    documentsURL: [{
        type: String,
        default:""
    }],
    likesCount: {
        type:Number,
        default: 0
    },
    commentsCount: {
        type:Number,
        default: 0
    }
});

PostSchema.pre('updateOne', function(next) {    
    // Update last_modified only if attributes other than likesCount and commentsCount are modified
    if (this.isModified() && !this.isModified('likesCount') && !this.isModified('commentsCount')) {
        this.last_modified = new Date();
    }
    next();
});

module.exports = mongoose.model('post', PostSchema);