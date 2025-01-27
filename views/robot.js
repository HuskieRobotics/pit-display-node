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

// move map code into a new fucntion in routes.js and require and call it
let newTasks;

function makeTaskObject(tasks) {
  const newTasks = tasks.map((task) => {
    return {
      name: task.name,
      checklistItems: task.checklistItems.map((item) => {
        return {
          taskName: item,
          checked: false,
        };
      }),
    };
  });
  return newTasks;
}
console.log(newTasks);
function updateChecked(task) {
  const taskIndex = newTasks.checklistItems.findIndex(
    (t) => t.taskName === task.taskText
  );
  newTasks.checklistItems[taskIndex].checked = task.isChecked;
}

module.exports = { formatTemperatures, makeTaskObject, updateChecked };
