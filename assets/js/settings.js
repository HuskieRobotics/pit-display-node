document.addEventListener("DOMContentLoaded", function () {
  // Validate event key format (from main branch)
  const eventKeyInput = document.getElementById("eventKey");
  if (eventKeyInput) {
    eventKeyInput.addEventListener("change", function() {
      const eventKey = eventKeyInput.value.trim();
      // Optional validation - event keys are typically in format YYYY[event code]
      // For example: 2024ksla
      if (eventKey && !eventKey.match(/^\d{4}[a-z0-9]+$/i)) {
        console.warn("Event key format may be incorrect. Expected format is YYYY followed by event code (e.g. 2024ksla)");
        // You could add visual feedback here if desired
      }
    });
  }

  // Handle custom streaming service form submission (from nexusNotifications branch)
  const dropdown = document.getElementById("streaming-service");
  const selectedService = document.getElementById("selected-service");
  const streamingLinkInput = document.getElementById("streaming-link");
  const submitButtonLink = document.getElementById("submit-button-link");

  if (submitButtonLink) {
    submitButtonLink.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent form submission if button is in a form
      // Capture the selected streaming service and streaming link
      const selectedServiceValue = dropdown ? dropdown.value : "";
      const streamingLinkValue = streamingLinkInput ? streamingLinkInput.value : "";
      console.log(`Selected service: ${selectedServiceValue}`);
      console.log(`Entered link: ${streamingLinkValue}`);

      const streamObject = {
        streamingService: selectedServiceValue,
        streamingLink: streamingLinkValue,
      };

      fetch("/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(streamObject),
      });
    });
  }
});