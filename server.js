/**
 * main Javascript file for the application
 * this file is executed by the Node server
 */

// load environment variables from the .env file into process.env
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

// import the http module, which provides an HTTP server
const http = require("http");

// import the express module, which exports the express function
const express = require("express");

// invoke the express function to create an Express application
const app = express();
const server = http.createServer(app);

// create a new web socket server object
const { createSocketServer } = require("./server/socket/socket");
createSocketServer(server);

// connect to MongoDB using mongoose
const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// add middleware to handle JSON in HTTP request bodies (used with POST commands)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set the template engine to EJS, which generates HTML with embedded JavaScript
app.set("view engine", "ejs");

// load assets
app.use("/css", express.static("assets/css"));
app.use("/img", express.static("assets/img"));
app.use("/js", express.static("assets/js"));
app.use("/html", express.static("assets/html"));

// to keep this file manageable, we will move the routes to a separate file
// the exported router object is an example of middleware
app.use("/", require("./server/routes/router"));

// start the server on port 8081
server.listen(8081, () => {
  console.log("server is listening on http://localhost:8081");
});
