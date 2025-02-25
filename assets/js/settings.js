document.addEventListener("DOMContentLoaded", function () {
  const submitButtonLink = document.getElementById("submit-button-link");

  submitButtonLink.addEventListener("click", function () {
    // Capture the selected streaming service, link, team name, and event key
    // const selectedService = document.getElementById("selected-service").value;
    const dropdown = document.getElementById("streamingService");
    const selectedService = dropdown.value;
    const streamingLinkInput = document.getElementById("streamingLink").value;
    const teamNumber = document.getElementById("teamNumber").value;
    const eventKey = document.getElementById("eventKey").value;

    // const dropdown = document.getElementById("streamingService");
    // const selectedService = dropdown.value;
    // const streamingLinkInput = document.getElementById("streamingLink").value;

    const streamObject = {
      streamingService: selectedService,
      streamingLink: streamingLinkInput,
      eventKey,
      teamNumber,
    };

    console.log(streamObject);

    fetch("/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(streamObject), // turns the js object reference into json form
    });
  });
});
