// This is the data that will be displayed on the pit display
var current_rank = "Rank 34";
var RS = "2.90 R";
var WL = "5W-7L";
var points_from_match = "141.20 Match";
var point_from_autos = "32.80 Auto";
var points_from_charge = "33.40";
var RP = "35 RP";
var upcoming_matches = ["t", "e", "s", "t"];
var past_matches = ["t", "e", "s", "t", "i", "n", "g"];

document.getElementById("past_matches").textContent = "Past Matches";
var list = document.getElementById("list_past_matches");
for (var i = 0; i < past_matches.length; i++) {
  var pi = document.createElement("pi");
  pi.textContent = past_matches[i];
  list.appendChild(pi);
}

document.getElementById("upcoming_matches").textContent = "Upcoming Matches";
var list = document.getElementById("list_upcoming_matches");
for (var i = 0; i < upcoming_matches.length; i++) {
  var pi = document.createElement("pi");
  pi.textContent = upcoming_matches[i];
  list.appendChild(pi);
}

// Interact with HTML elements to display the data from the variables using JS
document.getElementById("current_rank").innerHTML = current_rank;
document.getElementById("RS").innerHTML = RS;
document.getElementById("WL").innerHTML = WL;
document.getElementById("points_from_match").innerHTML = points_from_match;
document.getElementById("point_from_autos").innerHTML = point_from_autos;
document.getElementById("points_from_charge").innerHTML = points_from_charge;
document.getElementById("RP").innerHTML = RP;
