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
        }
    })
};

manager();