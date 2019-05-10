var sql = require('mysql');
var inq = require('inquirer');
var sqlPass = require('./pass.js');

sql.createConnection({
    host: 'localhost',

    port: '3306',

    user: 'root',

    password: sqlPass,

    database: 'bamazonDB'
});

