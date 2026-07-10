const dotenv = require("dotenv").config();
const dotenvExpand = require("dotenv-expand");
dotenvExpand.expand(dotenv);

const pinoLogger = require("../logger");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {body, validationResult} = require("express-validator");
const connectToDatabase = require("../models/db");

const express = require("express");
const router = express.Router();

const JWT_SECRET = `${process.env.JWT_SECRET}`;

//collection name database
const collectionName = 'users';

router.post("/register", async(req, res)=>{

    console.log("Inside /register");
    try {
        const db = await connectToDatabase();
        const collection = db.collection(collectionName);

        const existingEmail = await collection.findOne({email: req.body.email});

        if(existingEmail){
            return res.status(409).json({message: "user already exists"});
        };


        //Hashing password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);

        const newUser = await collection.insertOne({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hash,
            createdAt: new Date(),
        })

        const payload = {
            user: {
                id: newUser.insertedId,
            },
        };

        const authtoken = jwt.sign(payload, JWT_SECRET);
        const email = req.body.email;

        pinoLogger.info("User registered successfully");
        res.json({authtoken, email});
    

    }catch(error){
        res.status(500).json("Internal server error");
    }

    
});

router.post("/login", async (req, res)=>{
    console.log("inside Post");
    try {
        //Connect to database
        const db = await connectToDatabase();
        const userCollection = db.collection("users");

        const user = await userCollection.findOne({email: req.body.email});
        if (!user){
            pinoLogger.error("User not found");
            return res.status(404).json({error: "User not found"});
        }
        
        //Check password
        let result = await bcrypt.compare(req.body.password, user.password);
        if (!result){
            pinoLogger.error("Passwords do not match");
            return res.status(401).json({error: "Wrong password"});
        }

        const userName = user.firstName;
        const userEmail = user.email;

        //Create token
       let payload = {
            user: {
                id: user._id.toString(),
            }
       }

       const authtoken = jwt.sign(payload, JWT_SECRET);
       res.json({authtoken:authtoken, email: user.email});

    }catch(error){
        console.log(error)
    }

});



module.exports = router;