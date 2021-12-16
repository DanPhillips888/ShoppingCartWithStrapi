# ShoppingCartWithStrapi

repo to submit cart.jsx for assignment.
To run the restock functionality of the application you will need to run a strapi database 
for the API to be able to retrieve data containing products with correct criteria.

To run Refactors:
change index.html to include the cartRefactors.jsx file.
run index.html from a local server from the local folder.

cartRefactor.jsx contains the following changes:
items in cart and the checkout list have been condesed to maintain a numberInCart/checkout rather than multiple items.
Delete button on items in cart now works as intended changing the instock and incart numbers.
The checkout total has been adjusted to work with new cart format and keep a running total.

Further implementation being worked on is to remove the hard coded starting products and just use the 
strapi database entries.
