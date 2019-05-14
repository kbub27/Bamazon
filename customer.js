// REQUIRE ALL VARIABLES AND SET CONNECTIONS
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
var cusPrompt = (res) => {
    var questions = [
        {
            name: 'id',
            type: 'input',
            message: 'What is the id of the item you would like to buy?',
            validate: function (value) {
                if (isNaN(value) === false && (value > res.length) === false) {
                    return true;
                } else {
                    return false
                };
            },
        },
        {
            name: 'units',
            type: 'input',
            validate: function (value) {
                if (!isNaN(value)) {
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
        // SUBTRACT THE UNITS BOUGHT FROM BACK STOCK
        var remainingStock = Math.floor(res[Math.floor(Id - 1)].stock_quantity - Units);
        //QUERY FOR SELECTED ID 
        con.query('select item_id, product_name, price, stock_quantity from products where item_id = ?', Id, function (err, response) {
            if (err) throw err;

            console.log('\n===========================Ordered Item=============================\n');
            console.table(response);
            console.log('================================================================\n');

            if (Units > response[0].stock_quantity) {
                console.log('We do not have that many units in stock, sorry');
                customer();
            } else {
                console.log(
                    'You have Ordered ' + Units + ' ' +
                    response[0].product_name + '\n' +
                    'Your Total is : $' + response[0].price * Units +
                    '\nItems will be shipped as soon as payment is processed!\n'
                );
                // UPDATE THE DATABSE HERE
                con.query(
                    'update products set ? where ?',
                    [
                        {
                            stock_quantity: remainingStock
                        },
                        {
                            item_id: Id
                        }
                    ],
                    function (err) {
                        if (err) throw err
                    });
                // SHOW UPDATED ITEMS IN DB
                con.query('select * from products', function (err, res) {
                    if (err) throw err;

                    console.log('====================Products in stock===========================\n');
                    console.table(res);
                    console.log('================================================================\n');
                    buyAgain();
                });
            }
        });
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
        cusPrompt(res);
    });
};
// PROMPT TO ASK IF THEY WANT TO PURCHASE AGAIN
var buyAgain = () => {
    inq.prompt([
        {
            type: 'confirm',
            name: 'again',
            message: 'Would you like to purchase another item?'
        }
    ]).then(answer => {
        if (answer.again) {
            customer();
        } else {
            con.end();
        }
    })
}

customer();