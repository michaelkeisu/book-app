var express = require('express')
 	, path = require('path')
 	, bodyParser = require('body-parser')
	, mongoose = require('mongoose')
	, morgan = require('morgan')
	, config = require('./config');


var	app = express();
var port = config.port;
var testEnv = process.env.NODE_ENV === 'test';

if (testEnv) {
	mongoose.connect(config.testDatabase);
	port = config.testPort;
} else {
	app.use(morgan('tiny'));
	mongoose.connect(config.database);
}

app.set('port', port);
app.use(express.static(path.join(__dirname, 'client')));
app.use(bodyParser());

require('./routes')(app);

module.exports = app;

if(!testEnv) {
	app.listen(port, function () {
		console.log('server started, listening to port ' + port);
	});
}