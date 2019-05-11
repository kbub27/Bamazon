var sql = require('mysql');
var inq = require('inquirer');
var sqlPass = require('./pass.js');
var table = require('console.table');

//CREATE A FUNCTION FOR CUSTOMER PROMPT
var cusPrompt = (queryResults) => {
    var questions = [
        {
            name: 'id',
            type: 'list',
            choices: results,
            message: 'What is the id of the item you would like to buy?'
        },
        {
            name: 'units',
            type: 'input',
            validate: function (value) {
                if(!isNaN(value)) {
                    return true;
                } else {
                    return false
                }
            },
            message: 'How many units would you like to buy?'
        }
    ];


}

// CREATE FUNCTION TO DISPLAY THE DATA FROM THE DB THEN PROMPT QUESTIONS
var customer = () => {
    var con = sql.createConnection({
        host: 'localhost',

        port: '3306',

        user: 'root',

        password: sqlPass,

        database: 'bamazonDB'
    });
    //SHOW ITEMS IN STOCK TO THE CUSTOMER
    con.query('select * from products', function (err, res) {
        if (err) throw err;
        var results = [];
        for (let i = 0; i < res.length; i++) {
            results.push(res[i].item_id)
        };
        console.log('====================Products in stock===========================\n');
        console.table(res);
        console.log('================================================================\n');
        cusPrompt(results);
    });
    // PROMPT THE CUSTOMER WITH QUESTIONS AND RETURN THE RESULTS THEY WANT
}

customer();