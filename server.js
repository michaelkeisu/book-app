var express = require('express')
 	, path = require('path')
 	, bodyParser = require('body-parser')
	, mongoose = require('mongoose')
	, morgan = require('morgan');

mongoose.connect('mongodb://localhost:27017/book');

var	app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, 'client')));
app.use(bodyParser());

require('./routes')(app);

app.listen(app.get('port'), function () {
	console.log('server started, listening to port 3000');
});