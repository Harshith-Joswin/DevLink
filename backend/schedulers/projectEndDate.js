const Post = require('../models/Post');
const Bid = require('../models/Bid');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Function to check the project end date and provides notification to the developer and the client that project submission date has ended
checkProjectEndDate = async () => {
    try {
        const posts = await Post.find({
            $and: [
                { isNotified: { $ne: true } },
                { projectEndDate: { $lte: new Date() } }
            ]
        });

        for (const post of posts){
            await Post.findByIdAndUpdate(post._id, {isNotified: true});
            await Notification.create({user:post.developer, link:post._id, notificationType:"PROJECT_DATE_ENDED_DEVELOPER", message:`Project time ended, project: ${post.title}. Please upload source file of the solution.`});
            await Notification.create({user:post.user, link:post._id, notificationType:"PROJECT_DATE_ENDED_POSTER", message:`Project time ended. project: ${post.title}. Developer will shortly upload source file Developer.`});
        }
    } catch (error) {
        console.error("Error while creating notification", error);
        throw error;
    }
}

module.exports = checkProjectEndDate;