const nexusSocket = window.io();

nexusSocket.on("nexus", (info) => {
  console.log(info);
  openPopup(info);
});

function openPopup(info) {
  const popUp = document.getElementById("popup");
  const text = document.getElementById("popUpText");
  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Chicago",
  });
  if ("3061" in info.matches.redteams || "500" in info.matches.redteams) {
    popUp.classList.remove("blue-popup");
    popUp.classList.add("red-popup");
    console.log("red");
  }
  if ("3061" in info.matches.blueteams || "500" in info.matches.blueteams) {
    popUp.classList.remove("red-popup");
    popUp.classList.add("blue-popup");
    console.log("blue");
  }
  const time = info.matches[info.matches.length - 1].times.estimatedQueueTime;
  const label = info.matches[info.matches.length - 1].label;
  const status = info.matches[info.matches.length - 1].status;
  const val = status.charAt(0).toLowerCase() + status.slice(1);
  const formattedTime = formatter.format(time);
  text.innerHTML = label + " is " + val + " at " + formattedTime;
  popUp.classList.add("open-popup");
}

function closePopup() {
  const popUp = document.getElementById("popup");
  popUp.classList.remove("open-popup");
}
