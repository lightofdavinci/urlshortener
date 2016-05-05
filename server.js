'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var mongo = require('mongodb');
var api = require('./app/api/shortener.js');

var app = express();
require('dotenv').load({silent:true});

mongo.MongoClient.connect('mongodb://localhost:27017/shortener', function (err,db){

if(err){
    console.error('database failed to connect',err);
    } else { console.log ('connected to mongodb on port 27017');}

app.use('/public', express.static(process.cwd() + '/public'));

db.createCollection("sites",{
    capped:true,
    size:5242800,
    max:5000
});

routes(app,db);
api(app,db);

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});

});