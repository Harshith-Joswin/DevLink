require('dotenv').config();
const connectToMongo = require('./db')
const express = require('express');
const cors = require('cors');


const cron = require('node-cron');
const checkBiddingEndDate = require("./schedulers/biddingEndDate");
const checkProjectEndDate = require("./schedulers/projectEndDate");

// Connect node to express js
const app = express();
const port = process.env.PORT;
connectToMongo();

// Allow cross origin policy 
app.use(cors());

// Routes of the api
app.use('/api/auth/',require('./routes/authenticate'));
app.use('/api/profile/', require('./routes/profile'));
app.use('/api/post/', require('./routes/post'));
app.use('/api/solution/', require('./routes/solution'));
app.use('/api/notification/', require('./routes/notification'));


// Listen server to the specified port
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
