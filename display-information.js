var express = require("express");
var app = express();
var server = app.listen(3000);

app.locals.myVar = 1;

app.get("/", function (req, res) {
  res.render("display-information.ejs");
});

const submitButton = document.querySelector("input.submit");
submitButton.addEventListener("click", async () => {
  // get the values entered by the user
  const date = document.querySelector("input.date").value;
  // more sophisticated select that selects all input elements of class
  // habits that are checked.
  const habitOfMindButtons = document.querySelectorAll("input.habits:checked");
  const habitOfMind =
    habitOfMindButtons.length > 0 ? habitOfMindButtons[0].value : null;

  const content = document.querySelector("textarea.content").value;
  const entry = { date, habit: habitOfMind, content };

  const response = await fetch("/createEntry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  });

  if (response.ok) {
    window.location = "/";
  } else {
    console.log("error creating entry");
  }
});
