'use strict';

var express = require('express'),
    exphbs  = require('express-handlebars'),
    compression = require('compression');

var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static('public'));
app.use(compression());

app.get('/', function (req, res) {
    res.render('home');
});

app.listen(3000);
console.log("App listening on Port 3000!");
