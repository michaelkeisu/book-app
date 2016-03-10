import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import morgan from 'morgan'
import config from './config/config'
import routes from './rest/index.js'

var app = express();
var testEnv = process.env.NODE_ENV === 'test';

var port = testEnv ? config.testPort : config.port;
mongoose.connect(testEnv ? config.testDatabase : config.database);

app.set('port', port);
app.use(express.static(path.join(__dirname, 'client')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

routes(app);

export default app;

if (!testEnv) {
    app.use(morgan('tiny'));
    app.listen(port, () => {
        console.log(`server started, listening to port ${port}`);
    });
}