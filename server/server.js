const express = require('express');
const cors = require('cors');
const speech = require('./controllers/speech');
const app = express();

const corsOptions = {
    origin: 'http://localhost:3000', // or the specific origin you want to allow
    optionsSuccessStatus: 200
  };

app.use(cors());

app.get('/', (req, res) => {
  res.send('Success!');
});

app.post('/recognize', (req, res) => speech.handleRecognitionRequest(req, res));
app.get('/api/token', (req, res) => speech.getToken(req, res));

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
