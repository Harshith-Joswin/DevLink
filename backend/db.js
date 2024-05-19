const mongoose = require('mongoose');
const mongoURI = process.env.DB_URL;
const connectToMongo = () => {
    mongoose.connect(mongoURI)
    .then(() => console.log("Connected to database!!"))
    .catch(err => console.error("Error connecting to database:"));
}

module.exports = connectToMongo;
