document.addEventListener("DOMContentLoaded", function () {
  const dropdown = document.getElementById("streaming-service");
  const selectedService = document.getElementById("selected-service");
  const streamingLink = document.getElementById("streaming-link");
  const teamName = document.getElementById("Team Name");
  const eventKey = document.getElementById("Event key");
  const submitButtonLink = document.getElementById("submit-button");
  // const submitButtonTeamName = document.getElementById("submit-button-teamname");
  // const submitButtonEventKey = document.getElementById("submit-button-eventkey");

  dropdown.addEventListener("change", function () {
    selectedService.textContent = `Selected service: ${dropdown.value}`;
    console.log("Selected service: ", dropdown.value);
    // save the current choice even after going to the homepage again
  });

  submitButtonLink.addEventListener("click", function () {
    // Capture the selected streaming service, link, team name, and event key
    const selectedServiceValue = dropdown.value;
    const streamingLinkValue = streamingLink.value;
    const teamNameValue = teamName.value;
    const eventKeyValue = eventKey.value;

    // Log the selected streaming service, link, team name, and event key
    console.log(`Selected service: ${selectedServiceValue}`);
    console.log(`Entered link: ${streamingLinkValue}`);
    console.log(`Entered team name: ${teamNameValue}`);
    console.log(`Entered event key: ${eventKeyValue}`);
    // save all of these values even after going to the homepage again
  });

  // add an event listener to the submit button for the team name

  // add an event listener to the submit button for the event key
});
