/**
 * main Javascript file for the application
 *  this file is executed by the Node server
 */

// import the express module, which exports the express function
const express = require("express");

// invoke the express function to create an Express application
const app = express();

// load environment variables from the .env file into process.env
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

// load assets
app.use(express.static("assets"));

// start the server on port 8080
app.listen(8080, () => {
  console.log("server is listening on http://localhost:8080");
});
