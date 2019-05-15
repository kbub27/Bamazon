# Bamazon

Mock amazon-like store front using mySQL.

---

## About

CUSTOMER.JS

---

Bamazon retreives a set of storefront data from mySQL then returns it into a table that yuo can then buy from.

The table will show and then you will be prompted with questions to determine what you would like to buy from the store front.

<img src='images\Screenshot (19).png' height='400px' width='800px'>

From There you will select an item id and a quantity of how many of that item you would like to purchase.
Once you have selected the store front will update then you will be given your order summary and asked if you would like to puwrchase again.

<img src='images/Screenshot (20).png' height='400px' width='800px'>

If you would like to buy again it reruns you through the previous prompt but with updated items in the DB.

If you wouldn't like to buy again you then would be exited out of the application.

---

MANAGER.JS

---

Bamazon when run in manager will ask a set of questions

<img src='images/Screenshot (21).png' height='400px' width='600px'>

* If View products for sale is selected 

   * It Show the items for sale

   * <img src='images/Screenshot (22).png'>

* If View Low inventory is selected

    * It shows low inventory items

    * <img src='images/Screenshot (23).png'>

* If add to inventory is selected 

    * It add to the stock amount of an already existing inventory item

    * <img src='images/Screenshot (25).png'>

    * Notice how item #4 changed in stock quantity

    * <img src='images/Screenshot (26).png'>

* If add new product is selected 

    * It lets you add a new product with department, price , and units you want available

    * <img src='images/Screenshot (24).png'>

    * <img src='images/Screenshot (26).png'>
---
## Components Used

* Javascript
* mySQL
* NODE.js