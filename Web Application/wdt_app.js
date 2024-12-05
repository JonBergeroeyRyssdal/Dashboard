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

  // Calling the staffUserGet function
  staffUserGet();

  let selectedRow = null;

  // Click event listener to each row to toggle the 'bg-success' class
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

  // "Out" button
  function staffOut() {
    if (!selectedRow) {
      alert("Please select a staff member.");
      return;
    }

    const minutesOut = prompt(
      "Please enter the number of minutes the staff member is out:"
    );
    if (minutesOut && !isNaN(minutesOut) && minutesOut > 0) {
      const currentTime = new Date();

      // Calculate "Out Time"
      const outTime = currentTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      // Calculate "Expected Return Time"
      const returnTime = new Date(
        currentTime.getTime() + minutesOut * 60000
      ).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
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

      // Store the out time and expected return time for later comparison
      selectedRow.data('outTime', currentTime);
      selectedRow.data('returnTime', new Date(currentTime.getTime() + minutesOut * 60000));
    } else {
      alert("Invalid input. Please enter a positive number.");
    }
  }

  // Attach the staffOut function to the "Out" button
  $(".btn-danger").on("click", staffOut);

  // Function to handle marking a staff member as "In"
  function staffIn() {
    if (!selectedRow) {
      alert("Please select a staff member.");
      return;
    }

    // Update the selected staff member's information
    const statusCell = selectedRow.find("td:nth-child(5)");
    const outTimeCell = selectedRow.find("td:nth-child(6)");
    const durationCell = selectedRow.find("td:nth-child(7)");
    const returnTimeCell = selectedRow.find("td:nth-child(8)");

    // Update cells
    statusCell.text("In");
    outTimeCell.text("");
    durationCell.text("");
    returnTimeCell.text("");

    // Clear the selection
    selectedRow.removeClass("bg-success");
    selectedRow = null;
  }

  // Attach the staffIn function to the "In" button
  $(".btn-success").on("click", staffIn);

  // Deselect row when clicking outside the table
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
    const timeString = currentDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    document.getElementById(
      "currentDateTime"
    ).textContent = `${dateString}, ${timeString}`;
  }

  updateDateTime();
  setInterval(updateDateTime, 1000);

  // Check if a staff member is late
  setInterval(function () {
    staffTable.find("tr").each(function () {
      const row = $(this);
      const returnTime = row.data('returnTime');
      const currentTime = new Date();

      // Check if the staff member is late
      if (returnTime && currentTime > returnTime) {
        const outTime = row.data('outTime');
        const minutesOut = Math.floor((currentTime - outTime) / 60000); // Difference in minutes

        if (minutesOut > 0) {
          staffMemberIsLate(row, minutesOut);
        }
      }
    });
  }, 60000); // Check every minute

  // Function to show the toast with late information
  function staffMemberIsLate(row, minutesOut) {
    const firstName = row.find("td").eq(1).text();
    const lastName = row.find("td").eq(2).text();
    const picture = row.find("td").eq(0).find("img").attr("src");

    // Create the toast element
    var toastElement = document.createElement('div');
    toastElement.classList.add('toast', 'bg-danger', 'text-white');
    toastElement.setAttribute('role', 'alert');
    toastElement.setAttribute('aria-live', 'assertive');
    toastElement.setAttribute('aria-atomic', 'true');

    toastElement.innerHTML = `
      <div class="toast-header">
        <img src="${picture}" class="rounded me-2" alt="Profile Picture">
        <strong class="me-auto">${firstName} ${lastName}</strong>
        <small>${minutesOut} minute(s) late</small>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">
        This staff member has been out for ${minutesOut} minute(s).
      </div>
    `;

    // Append the toast element to the toast container
    document.querySelector('.toast-container').appendChild(toastElement);

    // Initialize the toast with autohide: false so it won't disappear automatically
    var toast = new bootstrap.Toast(toastElement, {
      autohide: false
    });

    // Show the toast
    toast.show();
  }
});

  
