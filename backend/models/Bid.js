const mongoose = require('mongoose')
const { Schema } = mongoose;
const User = require('./User');
const Post = require('./Post');

const BidSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true

    },
    amount: {
        type: Number,
        default: 0
    },
    createdDate: {
        type: Date,
        default: Date.now,
        immutable: true
    }
});

module.exports = mongoose.model('bid', BidSchema);