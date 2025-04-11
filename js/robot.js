// Ensure the rest of the code uses the `socket` variable declared in the main HTML file

// Example usage of the socket variable
socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

// Add other socket event listeners and handlers as needed
