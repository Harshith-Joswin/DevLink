const mongoose = require('mongoose')
const User = require('./User');
const { Schema } = mongoose;

const NotificationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User", // Reference the User model
        required: true
    },
    message: {
        type: String,
        required: true
    },
    link: {
        type: String
    },
    notificationType: {
        type: String,
        required: true
    },
    new: {
        type: Boolean,
        default: true
    }, 
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    }
});

module.exports = mongoose.model('notification', NotificationSchema);