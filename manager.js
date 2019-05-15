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
            choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Exit Manager App.']
        }
    ];

    inq.prompt(promptQuestion).then(answer => {
        if (answer.selection === promptQuestion[0].choices[0]) {
            con.query('select * from products', function (err, res) {
                if (err) throw err;

                console.log('\n====================Products in stock===========================\n');
                console.table(res);
                console.log('================================================================\n');
                manager();
            });
        } else if (answer.selection === promptQuestion[0].choices[1]) {
            con.query('select * from products where stock_quantity < 300', function (err, res) {
                if (err) throw err;

                if (typeof res[0] === 'undefined') {
                    console.log('No items low in stock')
                } else {

                    console.log('\n====================Low Product Stock===========================\n');
                    console.table(res);
                    console.log('================================================================\n');
                    manager();
                }
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

                        console.log('\n====================Updated Stock Inventory===========================\n');
                        console.table(res);
                        console.log('=================================================================\n');
                        manager();
                    });
                });
            });
        } else if (answer.selection === promptQuestion[0].choices[3]) {
            inq.prompt([
                {
                    type: 'input',
                    name: 'product_name',
                    message: 'What is the name of the product you are adding?'
                },
                {
                    type: 'input',
                    name: 'department_name',
                    message: 'What is the name of the department this product belongs to?'
                },
                {
                    type: 'input',
                    name: 'price',
                    message: 'What is the asking price for this product?(Must be a number!)',
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        } else {
                            return false
                        };
                    },
                },
                {
                    type: 'input',
                    name: 'stock_quantity',
                    message: 'How many units of this product will you be adding?(Must be a number!)',
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        } else {
                            return false
                        };
                    },
                }
            ]).then(answers => {

                con.query("INSERT INTO products SET ?", answers, function (err, res, fields) {
                    if (err) throw err;
                    console.log(res);
                });

                con.query('select * from products', function (err, res) {
                    if (err) throw err;

                    console.log('\n====================Updated Stock Inventory===========================\n');
                    console.table(res);
                    console.log('=================================================================\n');
                    manager();
                });
            })
        } else {
            con.end();
        }
    })
};

manager();