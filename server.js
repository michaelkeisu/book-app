const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const config = require('./config/config.js');
const routes = require('./rest/index.js');

const app = express();
const testEnv = process.env.NODE_ENV === 'test';

const port = testEnv ? config.testPort : config.port;
mongoose.connect(testEnv ? config.testDatabase : config.database);

app.set('port', port);
app.use(express.static(path.join(__dirname, 'client')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

routes(app);

module.exports = app;

if (!testEnv) {
    app.use(morgan('tiny'));
    app.listen(port, () => {
        console.log(`server started, listening to port ${port}`);
    });
}