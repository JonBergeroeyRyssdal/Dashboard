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

  let selectedStaffRow = null;

  // Click event listener to each row to toggle the 'bg-success' class
  staffTable.on("click", "tr", function () {
    if (selectedStaffRow) {
      selectedStaffRow.removeClass("bg-success");
    }

    if (selectedStaffRow && selectedStaffRow[0] === this) {
      selectedStaffRow = null;
    } else {
      selectedStaffRow = $(this);
      selectedStaffRow.addClass("bg-success");
    }
  });

  // "Out" button
  function staffOut() {
    if (!selectedStaffRow) {
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

      selectedStaffRow.find("td").eq(4).text("Out");
      selectedStaffRow.find("td").eq(5).text(outTime);
      selectedStaffRow
        .find("td")
        .eq(6)
        .text(`${Math.floor(minutesOut / 60)}h ${minutesOut % 60}m`);
      selectedStaffRow.find("td").eq(7).text(returnTime);

      selectedStaffRow.data("outTime", currentTime);
      selectedStaffRow.data(
        "returnTime",
        new Date(currentTime.getTime() + minutesOut * 60000)
      );
      selectedStaffRow.data("toastShown", false); // Reset toast flag
      selectedStaffRow.data("dismissedToast", false); // Reset dismissed state
    } else {
      alert("Invalid input. Please enter a positive number.");
    }
  }

  // Attach the staffOut function to the "Out" button
  $("#out-button").on("click", staffOut);

  // Function to handle marking a staff member as "In"
  function staffIn() {
    if (!selectedStaffRow) {
      alert("Please select a staff member.");
      return;
    }

    // Update the selected staff member's information
    const statusCell = selectedStaffRow.find("td:nth-child(5)");
    const outTimeCell = selectedStaffRow.find("td:nth-child(6)");
    const durationCell = selectedStaffRow.find("td:nth-child(7)");
    const returnTimeCell = selectedStaffRow.find("td:nth-child(8)");

    // Update cells
    statusCell.text("In");
    outTimeCell.text("");
    durationCell.text("");
    returnTimeCell.text("");

    // Clear the selection
    selectedStaffRow.removeClass("bg-success");
    selectedStaffRow = null;
  }

  // Attach the staffIn function to the "In" button
  $("#in-button").on("click", staffIn);

  // Deselect row when clicking outside the table
  $(document).on("click", function (e) {
    if (!staffTable[0].contains(e.target)) {
      if (selectedStaffRow) {
        selectedStaffRow.removeClass("bg-success");
        selectedStaffRow = null;
      }
    }
  });

  

  // Toast that tells if the delivery driver is late
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

  const deliveryBoardTable = $("#deliveryBoard tbody");
  let selectedDeliveryRow = null;

  // Click event listener to each row to toggle the 'bg-success' class
  deliveryBoardTable.on("click", "tr", function () {
    if (selectedDeliveryRow) {
      selectedDeliveryRow.removeClass("bg-success");
    }

    if (selectedDeliveryRow && selectedDeliveryRow[0] === this) {
      selectedDeliveryRow = null;
    } else {
      selectedDeliveryRow = $(this);
      selectedDeliveryRow.addClass("bg-success");
    }
  });

  // Logic to remove the "bg-success" class when clicking anywhere else on the page
  $(document).on("click", function () {
    // If a row is selected, remove the "bg-success" class
    if (selectedDeliveryRow) {
      selectedDeliveryRow.removeClass("bg-success");
      selectedDeliveryRow = null;
    }
  });

  // Prevent click event on the delivery board table from propagating to document
  deliveryBoardTable.on("click", function (event) {
    event.stopPropagation();
  });

  // Function to handle adding a new delivery
  function addDelivery() {
    // Get the input values from the "Schedule Delivery" table
    const vehicle = document.querySelector("select.form-select").value;
    const name = document.querySelector(
      'input[placeholder="Enter name"]'
    ).value;
    const surname = document.querySelector(
      'input[placeholder="Enter surname"]'
    ).value;
    const phone = document.querySelector(
      'input[placeholder="Enter phone number"]'
    ).value; // Optional: validate if needed
    const address = document.querySelector(
      'input[placeholder="Enter delivery address"]'
    ).value;
    const returnTime = document.querySelector('input[type="time"]').value;

    // Ensure all fields are filled
    if (!vehicle || !name || !surname || !address || !returnTime) {
      alert("Please fill in all fields before adding.");
      return;
    }

    // Determine the icon based on the vehicle type
    let vehicleIcon;
    if (vehicle === "Car") {
      vehicleIcon = `<i class="fas fa-car"></i>`; // Font Awesome car icon
    } else if (vehicle === "Motorbike") {
      vehicleIcon = `<i class="fas fa-motorcycle"></i>`; // Font Awesome motorbike icon
    } else {
      vehicleIcon = vehicle; // Default fallback
    }

    // Get the tbody element of the "Delivery Board" table
    const deliveryBoardBody = $("#deliveryBoard tbody");

    // Create a new row for the "Delivery Board"
    const newRow = `
      <tr>
        <td class="text-center">${vehicleIcon}</td>
        <td class="text-center">${name}</td>
        <td class="text-center">${surname}</td>
        <td class="text-center">${phone}</td>
        <td class="text-center">${address}</td>
        <td class="text-center">${returnTime}</td>
      </tr>
    `;

    // Append the new row to the "Delivery Board" table
    deliveryBoardBody.append(newRow);

    // Optionally, clear the input fields after adding
    $("select.form-select").val("Car"); // Reset to default
    $(".form-control").val(""); // Clear all input fields
  }

  // Attach event listener to the "Add" button
  $("#addDeliveryBtn").on("click", addDelivery);

  // Toast that tells if the delivery driver is late
  function deliveryDriverIsLate(row, minutesLate) {
    if (row.data("dismissedToast")) {
      return; // Skip if the toast was manually dismissed
    }

    const name = row.find("td").eq(1).text(); // First Name
    const surname = row.find("td").eq(2).text(); // Last Name
    const vehicle = row.find("td").eq(0).html(); // Vehicle Icon
    const uniqueId = `delivery-${name}-${surname}`; // Unique ID

    // Remove old toast if present
    $(`#${uniqueId}`).remove();

    // Mark this row as having a toast shown
    row.data("toastShown", true);

    // Create a new toast element
    const toastElement = document.createElement("div");
    toastElement.classList.add("toast", "bg-warning", "text-black");
    toastElement.setAttribute("role", "alert");
    toastElement.setAttribute("aria-live", "assertive");
    toastElement.setAttribute("aria-atomic", "true");
    toastElement.id = uniqueId;

    toastElement.innerHTML = `
      <div class="toast-header">
        ${vehicle}
        <strong class="me-auto">${name} ${surname}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">
        Delivery driver ${name} ${surname} is ${minutesLate} minute(s) late.
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

  // Function to clear the selected delivery driver
  $("#clear-button").on("click", function () {
    if (!selectedDeliveryRow) {
      alert("Please select a delivery driver to clear.");
      return;
    }

    // Remove the selected row from the table
    selectedDeliveryRow.remove();
    selectedDeliveryRow = null; // Reset the selection
  });
  setInterval(function () {
    deliveryBoardTable.find("tr").each(function () {
      const row = $(this);
      const returnTimeText = row.find("td").eq(5).text();
      if (!returnTimeText) return;

      const returnTime = new Date();
      const [hours, minutes] = returnTimeText.split(":").map(Number);
      returnTime.setHours(hours, minutes, 0, 0);

      const currentTime = new Date();

      if (currentTime > returnTime) {
        const minutesLate = Math.floor((currentTime - returnTime) / 60000);

        if (minutesLate > 0) {
          deliveryDriverIsLate(row, minutesLate); // Trigger toast for late driver
        }
      }
    });
  }, 60000); // Check every minute

  // Update the date and time dynamically
  function digitalClock() {
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

  digitalClock();
  setInterval(updateDateTime, 1000);
});
