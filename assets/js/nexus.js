const nexusSocket = window.io();

nexusSocket.on("nexus", (info) => {
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
  const time = info.match[0].times.estimatedQueueTime;
  const label = info.match[0].label;
  const status = info.match[0].status;
  const val = status.charAt(0).toLowerCase() + status.slice(1);
  const formattedTime = formatter.format(time);
  text.innerHTML = label + " is " + val + " at " + formattedTime + "!";
  popUp.classList.add("open-popup");
}

function closePopup() {
  const popUp = document.getElementById("popup");
  popUp.classList.remove("open-popup");
}
