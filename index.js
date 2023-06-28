const mongoose = require("mongoose");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");

//Mongoose Configuration
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const shortUrlSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
});

const ShortUrl = mongoose.model("ShortUrl", shortUrlSchema);

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint

function isValidUrl(string){

  const expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
  return !!string.match(expression);

}

app.post("/api/shorturl/", (req, res) => {
  const input = req.body.url;
  if (!isValidUrl(input)){
    res.json({ error: "invalid url" });
    return;
  }
  const newURL = new ShortUrl({
    url: input,
  });

  newURL
    .save()
    .then((savedURL) => {
      console.log("URL saved to the database:", savedURL);
      res.json({ original_url: savedURL.url, short_url: savedURL._id });
    })
    .catch((error) => {
      console.error("Error saving URL to the database:", error);
      res.status(500).json({ error: "Failed to save URL" });
    });

});
app.get("/api/shorturl/:url", (req, res) => {
  const urlId = req.params.url;
  ShortUrl.findById(urlId, function (err, data) {
    if (err) {
      res.json({ error: err });
    } else if (data) {
      console.log('data:', data);
      res.redirect(data.url);
    } else {
      res.json({ error: "invalid url" });
    }
  });
});
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
