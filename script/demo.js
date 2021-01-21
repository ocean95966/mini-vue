var express = require('express');
var path = require('path')
var app = express();

const listenDir = path.join(__dirname, '../lib/')

app.use(express.static(listenDir));

app.listen(3000, function () { 
    console.log('listening [3000] at ' + listenDir) 
});