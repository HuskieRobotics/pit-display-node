const express = require("express");
const app = express();
const path = require("path");

// Set the view engine to EJS
app.set("view engine", "ejs");

// Set the directory for views
app.set("views", path.join(__dirname, "views"));

// Route to render the EJS file
app.get("/", (req, res) => {
  res.render("teamStats");
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
