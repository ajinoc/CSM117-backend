const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;

let bodyParser = require('body-parser');

let app = express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .post("/post/image", function(req, res) {
    let image = req.body.image;
    console.log(req.body);
    console.log(image);
   })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));
