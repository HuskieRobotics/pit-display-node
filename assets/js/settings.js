document.addEventListener("DOMContentLoaded", function () {
  const dropdown = document.getElementById("streaming-service");
  const selectedService = document.getElementById("selected-service");
  const streamingLink = document.getElementById("streaming-link");
  const submitButton = document.getElementById("submit-button");

  let isTwitch = false;

  dropdown.addEventListener("change", function () {
    selectedService.textContent = `Selected service: ${dropdown.value}`;
    isTwitch = dropdown.value.toLowerCase() === "twitch";
  });

  submitButton.addEventListener("click", function () {
    // captre the selected streamservice and link
    const selectedServiceValue = dropdown.value;
    const streamingLinkValue = streamingLink.value;
    // log selected streamservice and link bc need to test
    console.log(`Selected service: ${selectedServiceValue}`);
    console.log(`Entered link: ${streamingLinkValue}`);
  });
});
