var express = require('express');
var app = express();

var multer = require('multer');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var mongoose = require('mongoose');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({type:'website/json'}));

app.use(cookieParser());
app.use(session({secret: process.env.SESSION_SECRET}));

app.use(passport.initialize());
app.use(passport.session());

// configure a public directory to host static content
app.use(express.static(__dirname + '/public'));

//require ("./test/app.js")(app);
//require ("./assignment/app.js")(app);
require ("./project/app.js")(app);


var ipaddress = process.env.IP;
var port      = process.env.PORT || 7000;

app.listen(port, ipaddress);
