const mongoose = require('mongoose')
const { Schema } = mongoose;

// Schema for solution table
const SolutionSchema = new Schema({
    developer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post",
        required: true
    },
    sourceURL: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now,
        immutable: true
    }
});

module.exports = mongoose.model('solution', SolutionSchema);