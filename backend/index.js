require('dotenv').config();
const connectToMongo = require('./db')
const express = require('express');
const cors = require('cors');


const cron = require('node-cron');
const checkBiddingEndDate = require("./schedulers/biddingEndDate");
const checkProjectEndDate = require("./schedulers/projectEndDate");

const app = express();
const port = process.env.PORT;
connectToMongo();

app.use(cors());

app.use('/api/auth/',require('./routes/authenticate'));
app.use('/api/profile/', require('./routes/profile'));
app.use('/api/post/', require('./routes/post'));
app.use('/api/solution/', require('./routes/solution'));
app.use('/api/notification/', require('./routes/notification'));

cron.schedule('* * * * *', () => {
    checkBiddingEndDate();
    checkProjectEndDate();
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
