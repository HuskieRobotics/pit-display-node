document.addEventListener("DOMContentLoaded", function () {
  // Validate event key format
  const eventKeyInput = document.getElementById("eventKey");
  if (eventKeyInput) {
    eventKeyInput.addEventListener("change", function () {
      const eventKey = eventKeyInput.value.trim();
      // Optional validation - event keys are typically in format YYYY[event code]
      // For example: 2024ksla
      if (eventKey && !eventKey.match(/^\d{4}[a-z0-9]+$/i)) {
        console.warn(
          "Event key format may be incorrect. Expected format is YYYY followed by event code (e.g. 2024ksla)"
        );
        // You could add visual feedback here if desired
      }
    });
  }

  // Validate form before submission
  const settingsForm = document.querySelector('form[action="/settings"]');
  if (settingsForm) {
    settingsForm.addEventListener("submit", function (event) {
      const streamingService =
        document.getElementById("streamingService").value;
      const streamingLink = document.getElementById("streamingLink").value;

      if (!streamingService || !streamingLink) {
        event.preventDefault();
        alert("Please fill in all required fields");
      }

      // Validate streaming link format based on service
      if (
        streamingService === "twitch" &&
        !streamingLink.includes("twitch.tv/")
      ) {
        event.preventDefault();
        alert("Please enter a valid Twitch URL");
      }

      if (
        streamingService === "youtube" &&
        !streamingLink.includes("youtube.com/") &&
        !streamingLink.includes("youtu.be/")
      ) {
        event.preventDefault();
        alert("Please enter a valid YouTube URL");
      }
    });
  }
});
