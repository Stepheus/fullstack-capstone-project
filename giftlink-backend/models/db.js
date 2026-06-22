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
    };

    const client = new MongoClient(url);      

    try {
        await client.connect();
        console.log("connected to MongoDB server");

        dbInstance = client.db(dbName);

        // const collection = dbInstance.collection("gifts");
        // const gifts = await collection.find({});
        // console.log({gifts})

        // const cursor = await gifts.toArray();
        // console.log({cursor});

    }catch(error){
        console.error(error);
    }
    finally{
        await client.close();
        console.log("connetion closed ");

    }
    
    // return dbInstance;
    console.log("returning gitfdb database");
    return dbInstance;


}

module.exports = connectToDatabase;
