$(document).ready(function () {
    const staffTable = $("#staffTable");
  
    // Function to create a table row
    function createRow(user) {
      return `
        <tr>
            <td>
                <img
                    src="${user.picture.thumbnail}"
                    alt="Profile Picture"
                    class="img-fluid rounded-circle"
                    style="width: 50px; height: 50px"
                />
            </td>
            <td>${user.name.first}</td>
            <td>${user.name.last}</td>
            <td>${user.email}</td>
            <td>In</td>
            <td></td>
            <td></td>
            <td></td>
        </tr>`;
    }
  
    // Function to fetch staff users
    function staffUserGet() {
      $.ajax({
        url: "https://randomuser.me/api/?results=5",
        dataType: "json",
        success: function (data) {
          const users = data.results;
          users.forEach((user) => {
            const row = createRow(user);
            staffTable.append(row);
          });
        },
        error: function (error) {
          console.error("Error fetching users:", error);
        },
      });
    }
  
    // Call the function to load staff users
    staffUserGet();
  
    let selectedRow = null;
  
    // Add click event listener to each row to toggle the 'bg-success' class
    staffTable.on("click", "tr", function () {
      if (selectedRow) {
        selectedRow.removeClass("bg-success");
      }
  
      if (selectedRow && selectedRow[0] === this) {
        selectedRow = null;
      } else {
        selectedRow = $(this);
        selectedRow.addClass("bg-success");
      }
    });
  
    // "Out" button functionality
    $(".btn-danger").on("click", function () {
      if (!selectedRow) {
        alert("Please select a staff member.");
        return;
      }
  
      const minutesOut = prompt("Please enter the number of minutes the staff member is out:");
      if (minutesOut && !isNaN(minutesOut) && minutesOut > 0) {
        const currentTime = new Date();
  
        // Calculate "Out Time"
        const outTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
        // Calculate "Expected Return Time"
        const returnTime = new Date(currentTime.getTime() + minutesOut * 60000).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
  
        // Convert minutes to hours and minutes
        const hours = Math.floor(minutesOut / 60);
        const minutes = minutesOut % 60;
        const duration = `${hours > 0 ? hours + "h " : ""}${minutes}m`;
  
        // Update the row
        selectedRow.find("td").eq(4).text("Out");
        selectedRow.find("td").eq(5).text(outTime);
        selectedRow.find("td").eq(6).text(duration);
        selectedRow.find("td").eq(7).text(returnTime);
      } else {
        alert("Invalid input. Please enter a positive number.");
      }
    });
  
    $(document).on("click", function (e) {
      if (!staffTable[0].contains(e.target)) {
        if (selectedRow) {
          selectedRow.removeClass("bg-success");
          selectedRow = null;
        }
      }
    });
  
    // Update the date and time dynamically
    function updateDateTime() {
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const currentDate = new Date();
      const dateString = currentDate.toLocaleDateString("en-US", options);
      const timeString = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
      document.getElementById(
        "currentDateTime"
      ).textContent = `${dateString}, ${timeString}`;
    }
  
    updateDateTime();
    setInterval(updateDateTime, 1000);
  });
  
      