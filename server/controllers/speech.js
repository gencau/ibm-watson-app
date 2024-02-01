
require('dotenv').config();
const fs = require('fs');
const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const apiKey = process.env.IBM_API_KEY;
const serviceUrl = process.env.IBM_SERVICE_URL;

const speechToText = new SpeechToTextV1({
  authenticator: new IamAuthenticator({
    apikey: apiKey,
  }),
  serviceUrl: serviceUrl,
  headers: {
    'X-Watson-Learning-Opt-Out': 'true',
    'Transfer-encoding': 'chunked'
  }
});

const getToken = async (req, res) => {
    let tokenManager = speechToText.authenticator.tokenManager;
    try {
        const accessToken = await tokenManager.getToken();
        res.json({accessToken: accessToken, url: serviceUrl});
      } 
      catch (err) {
        console.log('Error: ', err);
        res.status(500).send(err);
      }
}

function onEvent(name, event) {
    console.log(name, JSON.stringify(event, null, 2));
}

// Not used right now...
const handleRecognitionRequest = (req, res) => {
    console.log('Handling recognition request');
    console.log("API key", apiKey);
    console.log("Service URL", serviceUrl);
    const params = {
        objectMode: false,
        contentType: 'audio/wav',
        model: 'en-US_NarrowbandModel',
        keywords: ['colorado', 'tornado', 'tornadoes'],
        keywordsThreshold: 0.5,
        maxAlternatives: 3,
        interimResults: true
    };

    const recognizeStream = speechToText.recognizeUsingWebSocket(params);
    fs.createReadStream('controllers/fame2_luaw_traffic.wav').pipe(recognizeStream);

    let transcription = '';
    let responseSent = false;

    recognizeStream.on('data', function(event) {
        onEvent('Data:', event);
        transcription += event;
    });

    recognizeStream.on('error', function(event) {
        onEvent('Error', event);
        if (!responseSent) {
            responseSent = true;
            res.status(500).send('Error transcribing audio'); 
        }
    });

    recognizeStream.on('close', function(event) {
        onEvent('Close', event);
        if (!responseSent) {
            responseSent = true;
            res.status(200).send(transcription);
        }
    });
}

module.exports = {
    handleRecognitionRequest: handleRecognitionRequest,
    getToken: getToken
}