# ShoppingCartWithStrapi

repo to submit cart.jsx for assignment.
To run the restock functionality of the application you will need to run a strapi database 
for the API to be able to retrieve data containing products with correct criteria.

if you are running the cartRefactored.jsx adjust the index.html to include this file and expect erroeous behaviour. 
The cart currently will stock from the items list and adjust instock and incart initially, but fails to re-render 
the cart once the itemsInCart and instock are changed.  The deleteCartItem function is being worked on to correct this.

The checkout total will also need fixing once the delete key works
