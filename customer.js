var sql = require('mysql');
var inq = require('inquirer');
var sqlPass = require('./pass.js');

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
        console.log('\n-----------PRODUCTS IN STOCK------------\n');
        for (let i = 0; i < res.length; i++) {
            console.log(
                'ID: ' + res[i].item_id,
                'Product: ' + res[i].product_name,
                'Price: ' + res[i].price,
                'In-Stock: ' + res[i].stock_quantity
                );
        };
        console.log('==============================================')
    });
    // PROMPT THE CUSTOMER WITH QUESTIONS AND RETURN THE RESULTS THEY WANT

}

customer();