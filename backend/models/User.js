const mongoose = require('mongoose')
const { Schema } = mongoose;

// Schema for User table
const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required:true
    },
    lastName: {
        type: String,
        default:""
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    skills: [{
        type: String,
        default:""
    }],
    occupation: {
        type: String,
        default:""
    },
    bio: {
        type: String,
        default:""
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    profilePhotoURL: {
        type: String,
        default:""
    },
    password:{
        type:String,
        required:true
    },
    followersCount: {
        type:Number,
        default: 0
    },
    followingCount: {
        type:Number,
        default: 0
    },
    interestedPlatforms: [{
        platform:{
            type:String,
            required: true
        },
        score: {
            type:Number,
            default:1
        }
    }],
    interestedTechnologies: [{
        technology:{
            type:String,
            required: true
        },
        score: {
            type:Number,
            default:1
        }
    }]
})

module.exports = mongoose.model('user', UserSchema);