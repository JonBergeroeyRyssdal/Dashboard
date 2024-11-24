function updateDateTime() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const currentDate = new Date();
    const dateString = currentDate.toLocaleDateString('en-US', options);
    const timeString = currentDate.toLocaleTimeString();

    document.getElementById("currentDateTime").textContent = `${dateString}, ${timeString}`;
  }

  // Call the function to display the date and time when the page loads
  updateDateTime();

  // Optional: Update the time every second
  setInterval(updateDateTime, 1000);