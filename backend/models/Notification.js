const mongoose = require('mongoose')
const { Schema } = mongoose;

const NotificationSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    message: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
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