function formatPowerStats(stats) {
  const totalCurrent = stats.find((s) => s.label === "Total Current");
  const voltage = stats.find((s) => s.label === "Battery Voltage");

  const formatValue = (value, unit) => {
    return value === null || value === undefined
      ? "N/A"
      : `${value.toFixed(1)}${unit}`;
  };

  const getValueColor = (value, type) => {
    if (value === null || value === undefined) return "#888888";

    if (type === "voltage") {
      if (value > 12.5) return "green";
      if (value > 11.5) return "yellow";
      if (value > 10.5) return "orange";
      return "red";
    } else {
      // current
      if (value < 50) return "DeepSkyBlue";
      if (value < 100) return "green";
      if (value < 150) return "yellow";
      if (value < 200) return "orange";
      return "red";
    }
  };

  const currentDisplay = `
    <div class="power-stat-container">
      <div class="power-stat-label">Total Current Draw</div>
      <div class="power-stat-value" style="color: ${getValueColor(
        totalCurrent?.value,
        "current"
      )}">
        ${formatValue(totalCurrent?.value, "A")}
      </div>
    </div>
  `;

  const voltageDisplay = `
    <div class="power-stat-container">
      <div class="power-stat-label">Battery Voltage</div>
      <div class="power-stat-value" style="color: ${getValueColor(
        voltage?.value,
        "voltage"
      )}">
        ${formatValue(voltage?.value, "V")}
      </div>
    </div>
  `;

  return { currentDisplay, voltageDisplay };
}

module.exports = { formatPowerStats };
