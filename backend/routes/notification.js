const fetchUser = require('../middlewares/fetchUser');
const Notification = require('../models/Notification');
const express = require('express');
const router = express.Router();

// Contains subroutes for notification route

// Checks for new notification
router.post('/new', fetchUser, (req, res) => {
    const notifications = Notification.updateMany({
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

// Fetches all notifications
router.post('/', fetchUser, (req, res) => {
    const notifications = Notification.find({ user: req.user.id });
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

module.exports = router;