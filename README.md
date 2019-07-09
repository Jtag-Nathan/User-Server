# User-Server

Welcome to my user server, built in node.js with express this will be a simple RESTful API for creating new users as well as logging them in.
The project will also include some basic protected routes and roles to allow for not only auth but access limits eg: a user can only view his own user details
however an 'Admin' can view all users this will first require autherization to check the user is logged in and then a role check to see if the user has the required
permissions for viewing and managing all users.

## Links

https://medium.com/@bhanushali.mahesh3/building-a-restful-crud-api-with-node-js-jwt-bcrypt-express-and-mongodb-4e1fb20b7f3d

https://www.npmjs.com/package/express-roles-authorization