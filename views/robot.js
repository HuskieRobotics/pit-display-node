function formatTemperatures(temperatures) {
  // Group temperatures by subsystem
  const drivetrainTemps = temperatures.filter(
    (t) => t.label.includes("Drive") || t.label.includes("Steer")
  );
  const intakeTemps = temperatures.filter((t) => t.label.includes("Intake"));
  const shooterTemps = temperatures.filter(
    (t) => t.label.includes("Shooter") || t.label.includes("Deflector")
  );
  const otherTemps = temperatures.filter(
    (t) =>
      !t.label.includes("Drive") &&
      !t.label.includes("Steer") &&
      !t.label.includes("Intake") &&
      !t.label.includes("Shooter") &&
      !t.label.includes("Deflector")
  );

  const formattedTemperatures = `
    <div class="temp1">
      ${drivetrainTemps
        .map(
          (temp) =>
            `<p style="color: ${getTemperatureColor(temp.value)}">${
              temp.label
            }: ${temp.value.toFixed(1)}°C</p>`
        )
        .join("\n")}
    </div>
    <div class="temp2">
      ${intakeTemps
        .map(
          (temp) =>
            `<p style="color: ${getTemperatureColor(temp.value)}">${
              temp.label
            }: ${temp.value.toFixed(1)}°C</p>`
        )
        .join("\n")}
      ${otherTemps
        .map(
          (temp) =>
            `<p style="color: ${getTemperatureColor(temp.value)}">${
              temp.label
            }: ${temp.value.toFixed(1)}°C</p>`
        )
        .join("\n")}
    </div>
    <div class="temp3">
      ${shooterTemps
        .map(
          (temp) =>
            `<p style="color: ${getTemperatureColor(temp.value)}">${
              temp.label
            }: ${temp.value.toFixed(1)}°C</p>`
        )
        .join("\n")}
    </div>`;

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
