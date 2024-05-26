const mongoose = require('mongoose');
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
        ref: "post", // Correct the reference to "post"
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
                for (const intTech of user.interestedTechnologies) {
                    if (intTech.technology == technology) {
                        user.interestedTechnologies[index].score++;
                        flag = false;
                        break;
                    }
                    index++;
                }
                if (flag) {
                    user.interestedTechnologies.push({ technology: technology, score: 1 });
                }
            }
            for (const platform of post.platforms) {
                let index = 0;
                let flag = true;
                for (const intPlat of user.interestedPlatforms) {
                    if (intPlat.platform == platform) {
                        user.interestedPlatforms[index].score++;
                        flag = false;
                        break;
                    }
                    index++;
                }
                if (flag) {
                    user.interestedPlatforms.push({ platform: platform, score: 1 });
                }
            }
            await user.save();
        }
    } catch (error) {
        console.error("Error updating likesCount:", error);
    }
});

// Pre-delete middleware to capture document data before deletion
LikeSchema.pre('findOneAndDelete', async function (next) {
    this._docData = await this.model.findOne(this.getFilter());
    next();
});

// Middleware to update likesCount when a like is deleted
LikeSchema.post('findOneAndDelete', async function (doc) {
    try {
        const docData = this._docData;
        const Post = mongoose.model('post');
        const post = await Post.findById(docData.post);
        const User = mongoose.model('user');
        const user = await User.findById(docData.user);
        if (post) {
            post.likesCount -= 1;
            await post.save();
        }
        if (user) {
            for (const technology of post.technologies) {
                let index = user.interestedTechnologies.findIndex(intTech => intTech.technology == technology);
                if (index !== -1) {
                    user.interestedTechnologies[index].score--;
                    if (user.interestedTechnologies[index].score == 0)
                        user.interestedTechnologies.splice(index, 1);
                }
            }
            for (const platform of post.platforms) {
                let index = user.interestedPlatforms.findIndex(intPlat => intPlat.platform == platform);
                if (index !== -1) {
                    user.interestedPlatforms[index].score--;
                    if (user.interestedPlatforms[index].score == 0)
                        user.interestedPlatforms.splice(index, 1);
                }
            }
            await user.save();
        }
    } catch (error) {
        console.error("Error updating likesCount:", error);
    }
});

module.exports = mongoose.model('like', LikeSchema);