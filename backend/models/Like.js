const mongoose = require('mongoose')
const { Schema } = mongoose;
const User = require('./User');
const Post = require('./Post');

const LikeSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    }
});

// Middleware to update likesCount when a new like is added
LikeSchema.post('save', async function (doc) {
    try {
        const Post = mongoose.model('post');
        const post = await Post.findById(doc.post);
        const User = mongoose.model('user');
        const user = await User.findById(doc.user);
        if (post) {
            post.likesCount += 1;
            await post.save();
        }

        if (user) {
            for (const technology of post.technologies) {
                let index = 0;
                let flag = true;
                for(const intTech of user.interestedTechnologies){
                    if(intTech.technology == technology){
                        user.interestedTechnologies[index].score++;
                        flag = false;
                        break;
                    }
                    index++;
                }
                if (flag) {
                    user.interestedTechnologies.push({ technology: technology, score:1});
                }
            }
            for (const platform of post.platforms) {
                let index = 0;
                let flag = true;
                for(const intPlat of user.interestedPlatforms){
                    if(intPlat.platform == platform){
                        user.interestedPlatforms[index].score++;
                        flag = false;
                        break;
                    }
                    index++;
                }
                if (flag) {
                    user.interestedPlatforms.push({ platform: platform, score:1});
                }
            }
            user.save();

        }
    } catch (error) {
        console.error("Error updating likesCount:", error);
    }
});

// Middleware to update likesCount when a like is deleted
LikeSchema.post('remove', async function (doc) {
    try {
        const Post = mongoose.model('post');
        const post = await Post.findById(doc.post);
        const User = mongoose.model('user');
        const user = await User.findById(doc.user);
        if (post) {
            post.likesCount -= 1;
            await post.save();
        }
        if (user) {
            for (const technology of post.technologies) {
                let index = 0;
                for(const intTech of user.interestedTechnologies){
                    if(intTech.technology == technology){
                        user.interestedTechnologies[index].score--;
                        if(user.interestedTechnologies[index].score==0)
                            user.interestedTechnologies(index, 1);
                        break;
                    }
                    index++;
                }
            }
            for (const platform of post.platforms) {
                let index = 0;
                for(const intPlat of user.interestedPlatforms){
                    if(intPlat.platform == platform){
                        user.interestedPlatforms[index].score++;
                        if(user.interestedPlatforms[index].score==0)
                            user.interestedPlatforms(index, 1);
                        break;
                    }
                    index++;
                }
            }
            user.save();

        }
    } catch (error) {
        console.error("Error updating likesCount:", error);
    }
});

module.exports = mongoose.model('like', LikeSchema);