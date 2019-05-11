var sql = require('mysql');
var inq = require('inquirer');
var sqlPass = require('./pass.js');
var table = require('console.table');
var con = sql.createConnection({
    host: 'localhost',

    port: '3306',

    user: 'root',

    password: sqlPass,

    database: 'bamazonDB'
});

//CREATE A FUNCTION FOR CUSTOMER PROMPT
var cusPrompt = () => {
    var questions = [
        {
            name: 'id',
            type: 'input',
            message: 'What is the id of the item you would like to buy?',
            validate: function (value) {
                if(!isNaN(value)) {
                    return true;
                } else {
                    return false
                }
            },
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

    inq.prompt(questions).then(answers => {
        var Id = answers.id;
        var Units = answers.units;
        //QUERY FOR SELECTED ID 
        con.query('select item_id, product_name, price, stock_quantity from products where item_id = ?', Id, function (err, response) {
            if (err) throw err;
            console.log('\n====================Purchased Item===========================\n');
            console.table(response);
            console.log('================================================================\n');
        })
    })
}

// CREATE FUNCTION TO DISPLAY THE DATA FROM THE DB THEN PROMPT QUESTIONS
var customer = () => {
    
    //SHOW ITEMS IN STOCK TO THE CUSTOMER
    con.query('select * from products', function (err, res) {
        if (err) throw err;
        
        console.log('====================Products in stock===========================\n');
        console.table(res);
        console.log('================================================================\n');
        cusPrompt();
    });
    // PROMPT THE CUSTOMER WITH QUESTIONS AND RETURN THE RESULTS THEY WANT
}

customer();