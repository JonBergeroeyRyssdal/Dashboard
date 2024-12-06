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
      const outTime = currentTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const returnTime = new Date(
        currentTime.getTime() + minutesOut * 60000
      ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  
      selectedRow.find("td").eq(4).text("Out");
      selectedRow.find("td").eq(5).text(outTime);
      selectedRow
        .find("td")
        .eq(6)
        .text(`${Math.floor(minutesOut / 60)}h ${minutesOut % 60}m`);
      selectedRow.find("td").eq(7).text(returnTime);
  
      selectedRow.data("outTime", currentTime);
      selectedRow.data(
        "returnTime",
        new Date(currentTime.getTime() + minutesOut * 60000)
      );
      selectedRow.data("toastShown", false); // Reset toast flag
      selectedRow.data("dismissedToast", false); // Reset dismissed state
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

  function staffMemberIsLate(row, minutesOut) {
    if (row.data("dismissedToast")) {
      return; // Skip if the toast was manually dismissed
    }
  
    const firstName = row.find("td").eq(1).text();
    const lastName = row.find("td").eq(2).text();
    const picture = row.find("td").eq(0).find("img").attr("src");
    const uniqueId = `${firstName}-${lastName}`; // Unique ID
  
    // Remove old toast if present
    $(`#${uniqueId}`).remove();
  
    // Mark this row as having a toast shown
    row.data("toastShown", true);
  
    // Create a new toast element
    const toastElement = document.createElement("div");
    toastElement.classList.add("toast", "bg-danger", "text-white");
    toastElement.setAttribute("role", "alert");
    toastElement.setAttribute("aria-live", "assertive");
    toastElement.setAttribute("aria-atomic", "true");
    toastElement.id = uniqueId;
  
    toastElement.innerHTML = `
      <div class="toast-header">
        <img src="${picture}" class="rounded me-2" alt="Profile Picture">
        <strong class="me-auto">${firstName} ${lastName}</strong>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">
        ${firstName} ${lastName} is ${minutesOut} minute(s) late.
      </div>
    `;
  
    document.querySelector(".toast-container").appendChild(toastElement);
  
    const toast = new bootstrap.Toast(toastElement, { autohide: false });
    toast.show();
  
    // Handle the manual dismissal of the toast
    toastElement.addEventListener("hidden.bs.toast", function () {
      row.data("dismissedToast", true); // Mark the toast as dismissed
    });
  }
  

  // Update the toast with new time every minute
  setInterval(function () {
    staffTable.find("tr").each(function () {
      const row = $(this);
      const returnTime = row.data("returnTime");
      const currentTime = new Date();

      if (returnTime && currentTime > returnTime) {
        const outTime = row.data("outTime");
        const minutesOut = Math.floor((currentTime - outTime) / 60000);

        if (minutesOut > 0) {
          staffMemberIsLate(row, minutesOut); // Update the existing toast
        }
      }
    });
  }, 60000); // Check every minute
});
