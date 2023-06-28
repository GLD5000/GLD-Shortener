require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint

app.post('/api/shorturl/', (req, res) =>{
  const input = req.body.url;
  res.json({url: input});
});
app.get('/api/shorturl/:url', (req, res) =>{
  res.json({url: req.params.url});

});
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
