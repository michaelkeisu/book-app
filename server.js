var express = require('express')
    , path = require('path')
    , bodyParser = require('body-parser')
    , mongoose = require('mongoose')
    , morgan = require('morgan')
    , config = require('./config');


var app = express();
var testEnv = process.env.NODE_ENV === 'test';

var port = testEnv ? config.testPort : config.port;
mongoose.connect(testEnv ? config.testDatabase : config.database);

app.set('port', port);
app.use(express.static(path.join(__dirname, 'client')));
app.use(bodyParser());

require('./routes')(app);

module.exports = app;

if (!testEnv) {
    app.use(morgan('tiny'));
    app.listen(port, () => {
        console.log('server started, listening to port ' + port);
    });
}