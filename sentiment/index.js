require('dotenv').config();
const express = require('express');
const axios = require('axios');
const logger = require('../giftlink-backend/logger');
const expressPino = require('express-pino-logger')({ logger });
const natural = require("natural");


const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(expressPino);

// Define the sentiment analysis route
// Task 3: create the POST /sentiment analysis
app.post('/sentiment', async (req, res) => {

    const {afin165} = import("afinn-165");
    
    // Task 4: extract the sentence parameter
    const { sentence } = req.query;
    console.log(sentence);

    if (!sentence) {
        logger.error('No sentence provided');
        return res.status(400).json({ error: 'No sentence provided' });
    }

    // Initialize the sentiment analyzer with the Natural's PorterStemmer and "English" language
    const Analyzer = natural.SentimentAnalyzer;
    const stemmer = natural.PorterStemmer;
    const tokenizer = new natural.WordTokenizer();
    const analyzer = new Analyzer("English", stemmer, "senticon");

    const tokenizedText = tokenizer.tokenize(sentence.toLowerCase());
    console.log({tokenizedText});


    // Perform sentiment analysis
    try {
        const analysisResult = analyzer.getSentiment(tokenizedText);


        let sentiment = "neutral";

        // Task 5: set sentiment to negative or positive based on score rules
       if (analysisResult < 0){
        sentiment = "negative";
       } else if(analysisResult >= 0.2) {
        sentiment = "positive";
       }
        

        // Logging the result
        logger.info(`Sentiment analysis result: ${analysisResult}`);

        //send back results
        res.status(200).json({sentimentScore: analysisResult, sentiment: sentiment});

    } catch (error) {
        logger.error(`Error performing sentiment analysis: ${error}`);
        // Task 7: if there is an error, return a HTTP code of 500 and the json {'message': 'Error performing sentiment analysis'}
        res.status(500).json({message: "Error performing sentiment analysis"});
    }
});

app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
});
