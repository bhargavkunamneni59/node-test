var Promise = require('bluebird');
var knex = require('knex');
var http = require('http');
var express = require('express');
var path = require('path');
var dotenv = require('dotenv');
var bodyParser = require('body-parser');

// Parse Environmental variables
dotenv.config({ path: path.resolve('./.env') });
var dbName = process.env.DB_NAME;
var config = require('./db/knexfile');
config.connection.database = dbName;




var db = require('./db/db.js');
var routes = require('./routes');

var appPort = process.env.APP_PORT;

db.raw('select \'Test Connection\'')
    .then(function (response) {
        const app = express();
        const server = new http.Server(app);
        app.set('db', db);
        app.use(bodyParser.json({ limit: '50mb' }));
        app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

        app.use('/', routes);

        server.listen(appPort, function () {
            console.log(`Server started on port ` + appPort);
        });
    })
    .catch(function (err) {
        console.log(err);
    });

