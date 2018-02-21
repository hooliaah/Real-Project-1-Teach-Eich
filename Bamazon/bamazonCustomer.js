var mysql = require('mysql');
var table = require('cli-table');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,

  // Your username
  user: 'root',

  // Your password
  password: '*****',
  database: 'bamazonDB'
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  showProductList();
});

function showProductList() {
    var table = new Table({
      head: ['Item ID', 'Product Name', 'Department', 'Price', 'Quantity Available']
    });
  
    connection.query("SELECT * FROM products", function(error, result) {
      for (var i = 0; i < result.length; i++) {
        table.push(
          [result[i].item_id, result[i].product_name, result[i].department_name, result[i].price, result[i].stock_quantity]
        );
      }
      console.log(table.toString());
    })
  }