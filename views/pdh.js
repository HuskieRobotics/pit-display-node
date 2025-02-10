function formatPDHCurrents(currents) {
  // Split currents into top (0-9), bottom (10-19), and low current (20-23)
  const topHighCurrents = currents.filter(
    (c) => c.channel >= 0 && c.channel <= 9
  );
  const bottomHighCurrents = currents.filter(
    (c) => c.channel >= 10 && c.channel <= 19
  );
  const lowCurrents = currents.filter(
    (c) => c.channel >= 20 && c.channel <= 23
  );

  const formatChannel = (channel) => {
    // For PDH currents, null/undefined is invalid, but 0 is valid
    const displayValue =
      channel.value === null || channel.value === undefined
        ? "N/A"
        : `${channel.value.toFixed(1)}A`;
    return `
      <div class="pdh-channel ${
        channel.channel >= 20 ? "low-current" : "high-current"
      }">
        <div class="channel-number">${channel.channel}</div>
        <div class="current-value" style="color: ${getCurrentColor(
          channel.value
        )}">
          ${displayValue}
        </div>
      </div>
    `;
  };

  const formattedPDH = `
    <div class="pdh-container">
      <div class="pdh-header">Power Distribution Hub Currents</div>
      <div class="pdh-high-current-section">
        <div class="pdh-row">
          ${topHighCurrents.map(formatChannel).join("")}
        </div>
        <div class="pdh-row">
          ${bottomHighCurrents.map(formatChannel).join("")}
        </div>
      </div>
      <div class="pdh-low-current-section">
        ${lowCurrents.map(formatChannel).join("")}
      </div>
    </div>`;

  return formattedPDH;
}

function getCurrentColor(current) {
  if (current === null || current === undefined) {
    return "#888888"; // Gray for N/A
  } else if (current < 5) {
    return "DeepSkyBlue"; // Low current
  } else if (current < 15) {
    return "green"; // Normal current
  } else if (current < 30) {
    return "yellow"; // Medium current
  } else if (current < 40) {
    return "orange"; // High current
  } else {
    return "red"; // Very high current
  }
}

module.exports = { formatPDHCurrents };
