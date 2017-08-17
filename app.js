/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
var path = require('path');
var location = require('./routes/Location');
var property = require('./routes/Property');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use('/style', express.static(path.join(__dirname, '/views/style')));
app.use('/jquery', express.static(path.join(__dirname , '/node_modules/jquery/dist/') ));
app.use('/bootstrap', express.static(path.join(__dirname , '/node_modules/bootstrap/dist/')) );



// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

app.get("/addLocation", location.create)
app.post("/addLocation", location.save)
app.get("/addProperty", property.create)
app.post("/addProperty", property.save)

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
