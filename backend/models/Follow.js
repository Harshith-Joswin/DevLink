const mongoose = require('mongoose');
const { Schema } = mongoose;
const User = require('./User');

const FollowSchema = new Schema({
    follower: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    following: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    }
});

FollowSchema.post('save', async function (doc) {
    try {
        if (doc.follower && doc.following) {
            const User = mongoose.model('user');
            const follower = await User.findById(doc.follower);
            const following = await User.findById(doc.following);
            if (follower && following) {
                following.followersCount += 1;
                follower.followingCount += 1;
                await following.save();
                await follower.save();
            }
        }
    } catch (error) {
        console.error("Error updating likesCount:", error);
    }
});

FollowSchema.post('remove', async function (doc) {
    try {
        if (doc.follower && doc.following) {
            const User = mongoose.model('user');
            const follower = await User.findById(doc.follower);
            const following = await User.findById(doc.following);
            if (follower.followingCount > 0 && following.followersCount > 0) {
                following.followersCount -= 1;
                follower.followingCount -= 1;
                await following.save();
                await follower.save();
            }
        }
    } catch (error) {
        console.error("Error updating likesCount:", error);
    }
});


module.exports = mongoose.model('follow', FollowSchema);