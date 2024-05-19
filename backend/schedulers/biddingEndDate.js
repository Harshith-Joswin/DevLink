const Post = require('../models/Post');
const Bid = require('../models/Bid');
const Notification = require('../models/Notification');
const User = require('../models/User');

checkBiddingEndDate = async () => {
    try {
        const posts = await Post.aggregate([
            {
                $match: {
                    $and: [
                        { isHandovered: { $ne: true } },
                        { biddingEndDate: { $lte: new Date() } }
                    ]
                }
            }
        ]);

        const postIds = posts.map(post => post._id);

        let bids = await Bid.aggregate([
            {
                $match: {
                    post: { $in: postIds }
                }
            },
            {
                $project: {
                    _id: 1,
                    user: 1,
                    amount: 1
                }
            }
        ]);

        let i = 0;
        for (const post of posts) {
            const bid = bids[i];
            await Post.findByIdAndUpdate(post._id, { cost: bid.amount, developer: bid.user, bid: bid._id, isHandovered: true });
            await Notification.create({ user: bid.user, link: bid._id, notificationType: "BID_SELECTED_DEVELOPER", message: `Congratulations!! You have won the project: ${post.title} at bidding amount: ${bid.amount} ` });
            await Notification.create({ user: post.user, link: bid._id, notificationType: "BID_SELECTED_POSTER", message: `Bidding ended!! project: ${post.title} Developer:  ${await User.findById(bid.user).username}` });
            i++;
        }
    } catch (error) {
        console.error("Error while creating notification", error);
        throw error;
    }
}

module.exports = checkBiddingEndDate;