# Week 1 reflection

Answer each question in 1–3 sentences, in your own words.

1. What is the difference between building a UI imperatively (plain DOM code) and declaratively (React)?
   -Plain DOM code is used to create and update each element by telling the program. In React we just create the UI, and React will handle the update.
2. Why must a component name start with a capital letter?
   -So React can differentiate between our components and HTML components
3. What does a fragment <>...</> do, and why not just use a <div>?
   -It ables you to group multiple elements without adding extra HTML elements.
4. Name one benefit of splitting the UI into small components.
   -Making the code easier to understand

# Week 6

1. Explain, step by step, what happens from the moment you click Place order until the new order appears on your Orders page. Name the functions in your own code that run, and say why you
   never call setOrders yourself.

When place order is clicked, handplePlaceOrder() is called. It calls placeOrders(), passing user, cart items and checkout details. Inside placeOrders(), the cart items are grouped by vendor using a Map, a new order is created using writeBatch() containing its informations and batch.commit() saves it in Firestore. clearCart() is called to empty the shopping cart and redirected to orders page. useMyOrders() calls subscribeToMyOrders() with students' UID. This function uses Firestore's onSnapshot() to listen for changes to the orders. Whenever a new order is added, Firestore automatically sends the updated data to the application, and the callback updates the orders state using setOrders().
setOrders() is not called directly from the Orders page because Firestore's onSnapshot() automatically provides the latest order data. The state is updated through the subscription callback.

2. Why is orders a top-level collection, and why does each order copy vendorName and each item’s name and price instead of storing only IDs?

The orders collection is stored at the top level because orders need to be accessed independently from vendors. This makes it easier to retrieve all orders belonging to a particular student by querying the studentUid field, even when the orders come from different vendors. Each order also stores a copy of vendorName, item names and prices instead of only storing their IDs because it may change over time. By keeping a copy of these details when the order is placed, the order history can still display the original information even if the vendor updates or removes a menu item later. This makes displaying order history easier because the application does not need to retrieve the vendor and menu documents separately every time an order is displayed.

3. Your personal feature: which Firestore path and fields hold its data, and which line of your code reads it? Paste that line.
