const fetchUser = require('../middlewares/fetchUser');
const Notification = require('../models/Notification');
const express = require('express');
const router = express.Router();


router.post('/new', fetchUser, async (req, res) => {
    const notifications = await Notification.find({
        user: req.user.id,
        new: false
    });

    Notification.updateMany({

        $and: [
            { user: { $eq: req.user.id } },
            { new: { $eq: true } }
        ]
    },
        { $set: { new: false } }
    );
    return res.json({
        count: notifications.length,
        notifications: notifications.map(notification => {
            return {
                id: notification._id,
                type: notification.notificationType,
                link: notification.link,
                message: notification.message,
                createdAt: notification.createdAt
            }
        })
    })
});

router.post('/', fetchUser, async (req, res) => {
    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
    await Notification.updateMany({
        $and: [
            { user: { $eq: req.user.id } },
            { new: { $eq: true } }
        ]
    },
        { $set: { new: false } }
    );

    return res.json({
        count: notifications.length,
        notifications: notifications.map(notification => {
            return {
                id: notification._id,
                type: notification.notificationType,
                link: notification.link,
                new: notification.new,
                message: notification.message,
                createdAt: notification.createdAt
            }
        })
    })
});

module.exports = router;