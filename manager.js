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

var manager = () => {
    var promptQuestion = [
        {
            type: 'list',
            name: 'selection',
            choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
        }
    ];

    inq.prompt(promptQuestion).then(answer => {
        if (answer.selection === promptQuestion[0].choices[0]) {
            con.query('select * from products', function (err, res) {
                if (err) throw err;

                console.log('\n====================Products in stock===========================\n');
                console.table(res);
                console.log('================================================================\n');

            });
        } else if (answer.selection === promptQuestion[0].choices[1]) {
            con.query('select * from products where stock_quantity < 30', function (err, res) {
                if (err) throw err;

                console.log('\n====================Low Product Stock===========================\n');
                console.table(res);
                console.log('================================================================\n');
            });
        } else if (answer.selection === promptQuestion[0].choices[2]) {
            con.query('select * from products', function (err, res) {
                if (err) throw err;

                console.log('\n====================Products in stock===========================\n');
                console.table(res);
                console.log('================================================================\n');

                inq.prompt([
                    {
                        name: 'id',
                        type: 'input',
                        message: 'What is the id of the item you would like to add?',
                        validate: function (value) {
                            if (isNaN(value) === false && (value > res.length) === false) {
                                return true;
                            } else {
                                return false
                            };
                        },
                    },
                    {
                        name: 'add',
                        type: 'input',
                        message: 'How many units would you like to add?',
                        validate: function (value) {
                            if (isNaN(value) === false) {
                                return true;
                            } else {
                                return false
                            };
                        },
                    }
                ]).then(answer => {
                    var Id = answer.id;
                    var Units = answer.add;
                    // ADD THE UNITS TO THE STOK IN THE DB
                    var newStock = Math.floor(res[Math.floor(Id - 1)].stock_quantity += parseInt(Units));

                    con.query(
                        'update products set ? where ?',
                        [
                            {
                                stock_quantity: newStock
                            },
                            {
                                item_id: Id
                            }
                        ],
                        function (err) {
                            if (err) throw err
                        });
                    // SHOW UPDATED STOCK INVENTORY
                    con.query('select * from products', function (err, res) {
                        if (err) throw err;

                        console.log('====================Updated Stock Inventory===========================\n');
                        console.table(res);
                        console.log('=================================================================\n');

                    });
                });
            });
        } else if (answer.selection === promptQuestion[0].choices[3]) {
            console.log('last manager query.')
        }
    })
};

manager();