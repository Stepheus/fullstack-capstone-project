/*jshint esversion: 8 */
require('dotenv').config();
const express = require('express');
const app = express();

const cors = require('cors');
const pinoLogger = require('./logger');

const connectToDatabase = require('./models/db');
const {loadData} = require("./util/import-mongo/index");


app.use("*", cors({
    origin: 'http://localhost:3000', // Swap with your actual frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}
));
const port = 3060;

//load data to database
console.log("Loading data to database");
loadData().then(()=>{
    pinoLogger.info('Loading data to DB');
}).catch((error)=>{
    console.error("Failed to load data to database");
});

// Connect to MongoDB; we just do this one time
connectToDatabase().then(() => {
    pinoLogger.info('Connected to DB');
})
    .catch((e) => console.error('Failed to connect to DB', e));


app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Pino Logger
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


// auth Route
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);


// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
});

app.get("/",(req,res)=>{
    res.send("Inside the server");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
