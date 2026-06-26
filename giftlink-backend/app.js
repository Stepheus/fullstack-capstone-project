/*jshint esversion: 8 */
require('dotenv').config();
const express = require('express');
const app = express();

const cors = require('cors');
const pinoLogger = require('./logger');

const connectToDatabase = require('./models/db');
const {loadData} = require("./util/import-mongo/index");


app.use("*",cors());
const port = 3060;

// Connect to MongoDB; we just do this one time
connectToDatabase().then(() => {
    pinoLogger.info('Connected to DB');
})
    .catch((e) => console.error('Failed to connect to DB', e));


app.use(express.json());

// Route files
// Gift API Task 1: import the giftRoutes and store in a constant called giftroutes
//{{insert code here}}




// Search API Task 1: import the searchRoutes and store in a constant called searchRoutes
//{{insert code here}}


const pinoHttp = require('pino-http');
const logger = require('./logger');


app.use(pinoHttp({ logger }));

// Routes
// Gift API giftRoutes

const giftRouter = require("./routes/giftRoutes");
app.use("/api/gifts", giftRouter);

// Search API searchRoutes
const searchRoutes = require("./routes/searchRoutes");
app.use("/api/search", searchRoutes);


// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
});

app.get("/",(req,res)=>{
    res.send("Inside the server")
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
