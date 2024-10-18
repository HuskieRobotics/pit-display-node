function formatTemperatures(temperatures) {
  let formattedTemperatures = `<div class="temp1">`;

  temperatures.forEach((temperature) => {
    formattedTemperatures += `<p style="color: ${getTemperatureColor(
      temperature.value
    )}">${temperature.label}: ${temperature.value.toFixed(1)}°C</p>
    `;
  });

  formattedTemperatures += "</div>";

  return formattedTemperatures;
}

function getTemperatureColor(temperature) {
  if (temperature < 30) {
    return "DeepSkyBlue";
  } else if (temperature < 50) {
    return "green";
  } else if (temperature < 80) {
    return "yellow";
  } else if (temperature < 100) {
    return "orange";
  } else {
    return "red";
  }
}

module.exports = { formatTemperatures };
