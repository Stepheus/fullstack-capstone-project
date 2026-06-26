// db.js
const dotenv = require('dotenv').config();
const dotenvExpand = require("dotenv-expand");
dotenvExpand.expand(dotenv);
const MongoClient = require('mongodb').MongoClient;

// MongoDB connection URL with authentication options
let url = `${process.env.MONGO_URL}`;

let dbInstance = null;
const dbName = "giftdb";

async function connectToDatabase() {
    if (dbInstance){
        return dbInstance
        console.log({dbInstance})
    };

    const client = new MongoClient(url);      
        await client.connect();
        console.log("connected to MongoDB server");

        dbInstance = client.db(dbName);
        
        console.log("returning gitfdb database");
        return dbInstance;
       
}

module.exports = connectToDatabase;
