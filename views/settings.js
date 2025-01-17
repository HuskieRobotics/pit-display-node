document.addEventListener("DOMContentLoaded", function () {
  const dropdown = document.getElementById("streaming-service");
  const selectedService = document.getElementById("selected-service");

  dropdown.addEventListener("change", function () {
    selectedService.textContent = `Selected service: ${dropdown.value}`;
  });
});
