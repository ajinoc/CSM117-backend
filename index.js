const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;

let bodyParser = require('body-parser');

let app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/", function(req, res) {
    console.log(req.body);
    res.send("Successful post");
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
