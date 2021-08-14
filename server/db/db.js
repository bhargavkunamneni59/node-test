const knex = require("knex");
const knexfile = require("./knexfile");
console.log(knexfile);
const db = knex(knexfile);

module.exports = db;