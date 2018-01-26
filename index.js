const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;

let bodyParser = require('body-parser');

let app express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/post/image", function(req, res) {
    var image = req.body.image;
    console.log(image);
});
