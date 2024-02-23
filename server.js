const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;

// Function to generate live data
function generateLiveData() {
  // Generate live data (replace this with your own data fetching mechanism)
  const liveData = {
    message: "This is live data fetched from an API.",
    timestamp: new Date().toISOString(),
  };
  return liveData;
}

// Function to generate HTML with live data
function generateHTMLWithData(data) {
  // Generate HTML content dynamically with live data
  const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Live Data</title>
        </head>
        <body>
            <h1>Live Data</h1>
            <p>${JSON.stringify(data)}</p>
        </body>
        </html>
    `;
  return htmlContent;
}

// Serve JSON with live data
app.get("/", (req, res) => {
  // Generate live data
  const liveData = generateLiveData();

  // Generate HTML with live data
  const htmlContent = generateHTMLWithData(liveData);

  // Write HTML content to a temporary file
  fs.writeFileSync("display-information.html", htmlContent);

  // Send the HTML file as the response
  res.sendFile("display-information.html", { root: __dirname });

  // Delete HTML file after sending
  fs.unlinkSync("display-information.html");
});

// Start server
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
