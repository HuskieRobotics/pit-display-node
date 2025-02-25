document.addEventListener("DOMContentLoaded", function () {
  // Form is now handled by native HTML form submission in settings.ejs
  // This JS file is no longer needed for the basic functionality
  
  // We can still use this for form validation or dynamic UI updates if needed
  
  // Example for validating event key format (optional enhancement)
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
});
