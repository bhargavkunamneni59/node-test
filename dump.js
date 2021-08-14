var path = require('path');
var dotenv = require('dotenv');
var Promise = require('bluebird');
var fs = require('fs');

// Parse Environmental variables
dotenv.config({ path: path.resolve('./.env') });

var db = require('./server/db/db.js');

var dbName = process.env.DB_NAME;

var dbExists = `SHOW DATABASES like '${dbName}'`;

function dump() {
    return db.raw(dbExists)
        .then(function (response) {
            if (response[0].length) {
                console.log(`${dbName} already exists in database`);
                process.exit();
            } else {
                createDatabaseAndTables().then(function (response) {
                    process.exit();
                });
            }
        })
        .catch(function (err) {
            console.log(err);
        });
}

function createDatabaseAndTables() {
    var dbCreate = `create database ${dbName}`;
    return db.raw(dbCreate)
        .then(function (response) {
            console.log(` ${dbName} database created successfully`);
            var universitiesTable = db.raw(`CREATE TABLE ${dbName}.universities (
	            id BIGINT NOT null AUTO_INCREMENT,
	            name VARCHAR(255),
	            description LONGTEXT,
	            country varchar(255),
	            minimum_gpa real,
	            minimum_gre_score int,
	            CONSTRAINT pk_universities PRIMARY KEY (id)
            )`);

            var courseTable = db.raw(`CREATE TABLE ${dbName}.courses (
	            id BIGINT NOT null AUTO_INCREMENT,
	            university_id bigint,
	            name VARCHAR(255),
	            teacher_name varchar(255),
	            CONSTRAINT PK_courses PRIMARY KEY (id)
            )`);

            return Promise.all([universitiesTable, courseTable])
                .then(function () {
                    console.log('tables created successfully');
                    var data = JSON.parse(fs.readFileSync('data.json'));
                    var universities = data.universities;
                    var courses = data.courses;
                    return Promise.all([db.table(`${dbName}.universities`).insert(universities),
                        db.table(`${dbName}.courses`).insert(courses)]
                    ).then(function () {
                        console.log('data inserted success fully');
                        return;
                    })
                }).catch(function (err) {
                    console.log(err);
                });
        })
        .catch(function (err) {
            console.log(err);
        });
}

dump();

