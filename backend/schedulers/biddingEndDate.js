const Post = require('../models/Post');
const Bid = require('../models/Bid');
const Notification = require('../models/Notification');
const User = require('../models/User');
const mongoose = require('mongoose');

async function getBids(postId, page, limit) {

    try {
        postId = new mongoose.Types.ObjectId(postId);
        const skip = (page - 1) * limit;
        const bids = await Bid.aggregate([
            { $match: { post: postId } },
            { $sort: { amount: -1 } },
            { $limit: limit }
        ]);

        return bids[0];
    } catch (error) {
        console.error("Error fetching bids:", error);
        throw error;
    }
}

const checkBiddingEndDate = async () => {
    try {
        const posts = await Post.aggregate([{ $match:{ $and:[ { biddingEndDate: { $lte: new Date() }}, {isHandovered:false}] } }]);

        for (const post of posts) {
            const bid = await getBids(post._id, 1, 1);
            if (bid) {
                const developer = await User.findById(bid.user);
                await Notification.create({ user: bid.user, link: bid._id, notificationType: "BID_SELECTED_DEVELOPER", message: `Congratulations!! You have won the project: ${post.title} at bidding amount: ${bid.amount}` });
                await Notification.create({ user: post.user, link: bid._id, notificationType: "BID_SELECTED_POSTER", message: `Bidding ended!! project: ${post.title} Developer: ${developer.username}` });
                await Post.findByIdAndUpdate(post._id, { cost: bid.amount, developer: bid.user, bid: bid._id, isHandovered: true });
            } else {
                const note = await Notification.findOne({notificationType: "BID_ENDED_POSTER", message: `Bidding date ended But no bids. project: ${post.title}`})
                console.log(note);
                if(!note)
                await Notification.create({ user: post.user, notificationType: "BID_ENDED_POSTER", message: `Bidding date ended But no bids. project: ${post.title}` });
            }

        }
    } catch (error) {
        console.error("Error while creating notification", error);
        throw error;
    }
};

module.exports = checkBiddingEndDate;
