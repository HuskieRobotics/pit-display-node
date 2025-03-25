document.addEventListener("DOMContentLoaded", function () {
  const toggleSwitch = document.getElementById("server-toggle");
  const toggleText = document.querySelector(".toggle-text");

  if (toggleSwitch) {
    // Load saved preference from localStorage if available
    const savedPreference = localStorage.getItem("serverMode");
    if (savedPreference) {
      toggleSwitch.checked = savedPreference === "production";
      updateToggleText();
    }

    // Add event listener for toggle change
    toggleSwitch.addEventListener("change", function () {
      updateToggleText();

      // Save preference to localStorage
      const mode = toggleSwitch.checked ? "production" : "development";
      localStorage.setItem("serverMode", mode);

      // Send preference to server
      fetch("/toggle-server-mode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mode }),
      })
        .then(() => {
          // Reload the page to apply the new server URL
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error toggling server mode:", error);
        });
    });
  }

  function updateToggleText() {
    if (toggleText) {
      toggleText.textContent = toggleSwitch.checked
        ? "Production"
        : "Development";
    }
  }
});
