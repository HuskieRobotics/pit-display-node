// Fetch the JSON data
fetch("checklist.json")
  .then((response) => response.json())
  .then((data) => {
    // Get the parent div
    const parentDiv = document.querySelector(".checklist");

    // Iterate over the JSON data
    for (let key in data.Checklist) {
      // Create a new div and a h2 element
      const div = document.createElement("div");
      const h2 = document.createElement("h2");
      h2.textContent = key;
      div.appendChild(h2);

      // Iterate over the array
      for (let item of data.Checklist[key]) {
        // Create an input and a label element
        const input = document.createElement("input");
        input.type = "checkbox";
        input.id = item;
        input.name = item;

        const label = document.createElement("label");
        label.htmlFor = item;
        label.textContent = item;

        // Append the input and label to the div
        div.appendChild(input);
        div.appendChild(label);
        div.appendChild(document.createElement("br"));
      }

      // Append the div to the parent div
      parentDiv.appendChild(div);
    }
  });
