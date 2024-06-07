const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = process.env.SECRET_KEY;

// Function to authenticate user using JWT token
const fetchUser = async (req, res, next) => {
    const token = req.header('auth_token');
    if (!token) {
        return res.status(401).json({ message: "user unathorized" });
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(data.user.id)
        if(user){
                req.user = {id:user._id.toString()};
                next();
    }
        else{
                return res.status(404).json({ message: "user not found" })
        }
    }
    catch (error) {
        console.log(error);
        res.status(401).json({ message: "user unathorized" });
    }
}

module.exports = fetchUser;