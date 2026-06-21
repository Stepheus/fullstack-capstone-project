// db.js
require('dotenv').config();
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
        
        //test
        const collection = dbInstance.listCollections.toArray();
        for (col in collection){
            console.log(col.find());
        }


    }catch(error){
        console.error(error)
    }
    finally{
        await client.close();
        console.log("connetion closed ");


    }
    
    return dbInstance;



}

module.exports = connectToDatabase;
