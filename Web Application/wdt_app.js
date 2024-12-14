// Parent
class Employee {
  constructor(name, surname) {
    this.name = name;
    this.surname = surname;
  }
}

// StaffMember Class
// Object to track notified and dismissed staff members
const notifiedStaffMembers = {};

// StaffMember Class
class StaffMember extends Employee {
  constructor(
    name,
    surname,
    picture,
    email,
    status = "In",
    outTime = null,
    duration = null,
    expectedReturnTime = null
  ) {
    super(name, surname);
    this.picture = picture;
    this.email = email;
    this.status = status;
    this.outTime = outTime;
    this.duration = duration;
    this.expectedReturnTime = expectedReturnTime;
  }
  //Toast should be shown, with the correct information, when a staff member has not returned by the expected return time. The notification should appear only once, and the receptionist must close or clear the notification.
  //(There must be a staffMemberIsLate function)
  staffMemberIsLate() {
    // Ensure expectedReturnTime is valid
    if (!this.expectedReturnTime) {
      //  console.warn(
      //    `No expected return time set for ${this.name} ${this.surname}`
      //  );
      return;
    }

    const currentTime = new Date();
    const expectedReturnTime = new Date(this.expectedReturnTime);
    const timeDifference = (currentTime - expectedReturnTime) / (1000 * 60); // Time difference in minutes

    // Debug logs
    console.log(`${this.name} ${this.surname}: Current Time: ${currentTime}`);
    console.log(
      `${this.name} ${this.surname}: Expected Return Time: ${expectedReturnTime}`
    );
    console.log(
      `${this.name} ${this.surname}: Time Difference: ${timeDifference} minutes`
    );

    // Ensure the notification is not repeated
    if (!notifiedStaffMembers[this.email]) {
      notifiedStaffMembers[this.email] = { notified: false, dismissed: false };
    }

    const staffStatus = notifiedStaffMembers[this.email];
    if (timeDifference > 1 && !staffStatus.notified && !staffStatus.dismissed) {
      staffStatus.notified = true; // Mark as notified

      const minutesLate = Math.floor(timeDifference);

      // Create the toast element
      const toastElement = document.createElement("div");
      toastElement.classList.add("toast", "bg-danger", "text-white");
      toastElement.setAttribute("role", "alert");
      toastElement.setAttribute("aria-live", "assertive");
      toastElement.setAttribute("aria-atomic", "true");
      toastElement.setAttribute("data-bs-autohide", "false"); // Disable auto-hide

      toastElement.innerHTML = `
        <div class="toast-header">
          <img src="${this.picture}" class="rounded me-2" alt="Profile Picture" style="height: 50px; width: 50px;">
          <strong class="me-auto">${this.name} ${this.surname}</strong>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          Staff member ${this.name} ${this.surname} is ${minutesLate} minute(s) late.
        </div>
      `;

      // Append toast to the container
      const toastContainer = document.querySelector(".toast-container");
      if (!toastContainer) {
        console.error("Toast container not found.");
        return;
      }
      toastContainer.appendChild(toastElement);

      // Show the toast using Bootstrap
      const toast = new bootstrap.Toast(toastElement);
      toast.show();

      // Mark as dismissed if the user closes the toast
      toastElement.addEventListener("hidden.bs.toast", () => {
        staffStatus.dismissed = true; // Mark as dismissed
      });
    }
  }
}

// Object to track notified and dismissed delivery drivers
const notifiedDeliveryDrivers = {};

class DeliveryDriver extends Employee {
  constructor(name, surname, vehicle, telephone, deliveryAddress, returnTime) {
    super(name, surname);
    this.vehicle = vehicle;
    this.telephone = telephone;
    this.deliveryAddress = deliveryAddress;
    this.returnTime = returnTime;
  }
  //Toast should be shown, with the correct information, when a delivery driver has not returned by the estimated return time.
  //(There must be a deliveryDriverIsLate function)
  deliveryDriverIsLate() {
    // Ensure returnTime is valid
    if (!this.returnTime) {
      console.warn(`No return time set for ${this.name} ${this.surname}`);
      return;
    }
  
    const currentTime = new Date();
    const expectedReturnTime = new Date(this.returnTime);
    const timeDifference = (currentTime - expectedReturnTime) / (1000 * 60); // Time difference in minutes
  
    // Log key variables for debugging
    console.log(`Driver: ${this.name} ${this.surname}`);
    console.log(`Current Time: ${currentTime}`);
    console.log(`Expected Return Time: ${expectedReturnTime}`);
    console.log(`Time Difference (in minutes): ${timeDifference}`);
  
    // Ensure the notification is not repeated
    if (!notifiedDeliveryDrivers[this.telephone]) {
      notifiedDeliveryDrivers[this.telephone] = {
        notified: false,
        dismissed: false,
      };
    }
  
    const driverStatus = notifiedDeliveryDrivers[this.telephone];
    if (
      timeDifference > 1 &&
      !driverStatus.notified &&
      !driverStatus.dismissed
    ) {
      driverStatus.notified = true; // Mark as notified
  
      const minutesLate = Math.floor(timeDifference);
  
      // Format the expected return time to hh:mm
      const formattedReturnTime = expectedReturnTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, // 24-hour format
      });
  
      // Determine the vehicle icon
      const vehicleIcon =
        this.vehicle === "Car"
          ? `<i class="fas fa-car"></i>` // Font Awesome car icon
          : `<i class="fas fa-motorcycle"></i>`; // Font Awesome motorcycle icon
  
      console.log(
        `Driver ${this.name} is ${minutesLate} minutes late. Showing toast.`
      );
  
      // Create the toast element
      const toastElement = document.createElement("div");
      toastElement.classList.add("toast", "bg-warning", "text-black");
      toastElement.setAttribute("role", "alert");
      toastElement.setAttribute("aria-live", "assertive");
      toastElement.setAttribute("aria-atomic", "true");
      toastElement.setAttribute("data-bs-autohide", "false"); // Disable auto-hide
  
      toastElement.innerHTML = `
        <div class="toast-header">
          <span class="me-2">${vehicleIcon}</span> <!-- Add vehicle icon here -->
          <strong class="me-auto">${this.name} ${this.surname}</strong>
          <button type="button" class="btn-close btn-close-black" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          Delivery driver ${this.name} ${this.surname} is ${minutesLate} minute(s) late.<br>
          <strong>Phone:</strong> ${this.telephone}<br>
          <strong>Address:</strong> ${this.deliveryAddress}<br>
          <strong>Estimated Return Time:</strong> ${formattedReturnTime}
        </div>
      `;
  
      // Append toast to the container
      const toastContainer = document.querySelector(".toast-container");
      if (!toastContainer) {
        console.error("Toast container not found.");
        return;
      }
      toastContainer.appendChild(toastElement);
  
      // Show the toast using Bootstrap
      const toast = new bootstrap.Toast(toastElement);
      toast.show();
  
      // Mark as dismissed if the user closes the toast
      toastElement.addEventListener("hidden.bs.toast", () => {
        driverStatus.dismissed = true; // Mark as dismissed
      });
    }
  }
  
  
}

// Correct API call/s made on page load.
// The API JSON String response should be converted into a JS object/s, then used to create relevant class objects.
//Inheritance is used in object creation, using the data from the API call.
// Staff table populated with the objects of the five (5) unique staff members.
//(There must be a staffUserGet function that makes the API call(s) and processes the response(s), I.e., converts the API response(s) to the relevant JS class object(s)).
class staffUserGet {
  constructor() {
    this.selectedStaffMember = null; // Keep track of the selected staff member
    this.staffMembers = []; // Store all staff members
  }

  async getUsers() {
    try {
      const response = await fetch("https://randomuser.me/api/?results=5");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      // Populate the staffMembers array with properly instantiated objects
      this.staffMembers = this.createStaffMembers(data.results);

      // Populate the table with staff members
      this.appendToTable(this.staffMembers);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  createStaffMembers(users) {
    return users.map((user) => {
      const name = user.name.first;
      const surname = user.name.last;
      const picture = user.picture.thumbnail;
      const email = user.email;

      // Create and return a new StaffMember instance
      return new StaffMember(
        name,
        surname,
        picture,
        email,
        "In", // Default status
        null, // Default outTime
        null, // Default duration
        null // Default expectedReturnTime
      );
    });
  }

  appendToTable(staffMembers) {
    const tableBody = document.getElementById("staffTable");
    tableBody.innerHTML = ""; // Clear existing rows
    staffMembers.forEach((staffMember) => {
      // Format expectedReturnTime for display (if not null)
      const formattedExpectedReturnTime = staffMember.expectedReturnTime
        ? new Date(staffMember.expectedReturnTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "";

      const row = document.createElement("tr");

      row.innerHTML = `
        <td>
          <img
            src="${staffMember.picture}"
            alt="Profile Picture"
            class="img-fluid rounded-circle"
            style="width: 50px; height: 50px"
          />
        </td>
        <td>${staffMember.name}</td>
        <td>${staffMember.surname}</td>
        <td>${staffMember.email}</td>
        <td>${staffMember.status}</td>
        <td>${staffMember.outTime || ""}</td>
        <td>${staffMember.duration || ""}</td>
        <td>${formattedExpectedReturnTime}</td>
      `;

      // Store the StaffMember object directly in the row's data
      $(row).data("staffMember", staffMember);

      // Append the row to the table body
      tableBody.appendChild(row);
    });
  }

  checkAllLateStaff() {
    // console.log("Checking for late staff members...");

    this.staffMembers.forEach((staffMember) => {
      //   console.log(`Checking ${staffMember.name} ${staffMember.surname}...`);
      if (staffMember instanceof StaffMember) {
        staffMember.staffMemberIsLate();
      } else {
        console.error(
          "staffMember is not an instance of StaffMember:",
          staffMember
        );
      }
    });
  }
}

// Class to manage staff table row selection
class StaffRowSelector {
  constructor(tableSelector, staffManagerInstance) {
    this.table = $(tableSelector); // Reference to the table
    this.staffManager = staffManagerInstance; // Reference to staff manager instance
    this.selectedRow = null; // Track the currently selected row
    this.bindEvents(); // Initialize event bindings
  }

  bindEvents() {
    // Row click event
    this.table.on("click", "tr", (event) => this.handleRowClick(event));

    // Document click event for deselection
    $(document).on("click", (event) => this.handleOutsideClick(event));
  }

  handleRowClick(event) {
    const clickedRow = $(event.currentTarget);

    // Deselect the previously selected row
    if (this.selectedRow) {
      this.selectedRow.removeClass("bg-success");
    }

    // Toggle selection if the same row is clicked
    if (this.selectedRow && this.selectedRow[0] === clickedRow[0]) {
      this.selectedRow = null;
      this.staffManager.selectedStaffMember = null;
    } else {
      // Select the new row
      this.selectedRow = clickedRow;
      this.selectedRow.addClass("bg-success");

      const staffMemberData = this.selectedRow.data("staffMember");
      if (staffMemberData) {
        this.staffManager.selectedStaffMember = staffMemberData; // Use the stored object
      } else {
        console.error("No data-staffMember found for the selected row.");
      }
    }
  }

  handleOutsideClick(event) {
    if (!this.table[0].contains(event.target)) {
      if (this.selectedRow) {
        this.selectedRow.removeClass("bg-success");
        this.selectedRow = null;
        this.staffManager.selectedStaffMember = null;
      }
    }
  }
}

//Clicking ‘Out’ prompts the user for data, updates the relevant staff member’s object, and then updates the Staff table from the object.
//(There must be a staffOut function)
// Modify the staffOut function to utilize the object method

class staffOut {
  constructor(rowSelector) {
    this.rowSelector = rowSelector; // Reference to the row selector
  }

  execute() {
    const selectedStaffMember =
      this.rowSelector.staffManager.selectedStaffMember;

    if (!selectedStaffMember) {
      alert("Please select a staff member first.");
      return;
    }

    const minutesOut = prompt("How many minutes will the staff member be out?");
    if (minutesOut === null) return; // User canceled the prompt

    const parsedMinutes = parseInt(minutesOut, 10);
    if (isNaN(parsedMinutes) || parsedMinutes <= 0) {
      alert("Please enter a valid positive number for minutes.");
      return;
    }

    const currentTime = new Date();
    const expectedReturnTime = new Date(
      currentTime.getTime() + parsedMinutes * 60000
    );

    // Format expectedReturnTime for display (HH:mm)
    const formattedReturnTime = expectedReturnTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Calculate hours and minutes for the duration
    const hours = Math.floor(parsedMinutes / 60);
    const minutes = parsedMinutes % 60;
    const formattedDuration = `${hours}h:${minutes
      .toString()
      .padStart(2, "0")}m`;

    // Log before the update
    console.log("Before update:", selectedStaffMember);

    // Update the staff member's object
    selectedStaffMember.status = "Out";
    selectedStaffMember.outTime = currentTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    selectedStaffMember.duration = formattedDuration;
    selectedStaffMember.expectedReturnTime = expectedReturnTime.toISOString(); // Store in ISO format

    // Log after the update
    console.log("After update:", selectedStaffMember);

    // Update the staffManager.staffMembers array to reflect changes
    const staffIndex = this.rowSelector.staffManager.staffMembers.findIndex(
      (staff) => staff.email === selectedStaffMember.email
    );

    if (staffIndex !== -1) {
      this.rowSelector.staffManager.staffMembers[staffIndex] =
        selectedStaffMember;
    }

    // Log the updated staff member in the manager
    console.log(
      "Updated staff in manager:",
      this.rowSelector.staffManager.staffMembers[staffIndex]
    );

    // Update the selected row in the table
    const selectedRow = this.rowSelector.selectedRow;
    if (selectedRow) {
      selectedRow.html(`
        <td>
          <img
            src="${selectedStaffMember.picture}"
            alt="Profile Picture"
            class="img-fluid rounded-circle"
            style="width: 50px; height: 50px"
          />
        </td>
        <td>${selectedStaffMember.name}</td>
        <td>${selectedStaffMember.surname}</td>
        <td>${selectedStaffMember.email}</td>
        <td>${selectedStaffMember.status}</td>
        <td>${selectedStaffMember.outTime || ""}</td>
        <td>${selectedStaffMember.duration || ""}</td>
        <td>${formattedReturnTime || ""}</td> <!-- Display formatted time -->
      `);

      // Update the data attribute on the row
      selectedRow.data("staffMember", selectedStaffMember);
    }

    // Manually trigger check for late staff for debugging
    this.rowSelector.staffManager.checkAllLateStaff();
  }
}

//Clicking ‘In’ updates the relevant staff member’s object and updates the Staff table from the object.
//(There must be a staffIn function)
class staffIn {
  constructor(rowSelector) {
    this.rowSelector = rowSelector;
  }

  execute() {
    const selectedStaffMember =
      this.rowSelector.staffManager.selectedStaffMember;

    if (!selectedStaffMember) {
      alert("Please select a staff member first.");
      return;
    }

    // Update the status of the selected staff member
    selectedStaffMember.status = "In";
    selectedStaffMember.outTime = null;
    selectedStaffMember.duration = null;
    selectedStaffMember.expectedReturnTime = null;

    // Update the selected row directly
    const selectedRow = this.rowSelector.selectedRow;
    if (selectedRow) {
      // Update the row with the new status
      $(selectedRow).html(`
        <td>
          <img
            src="${selectedStaffMember.picture}"
            alt="Profile Picture"
            class="img-fluid rounded-circle"
            style="width: 50px; height: 50px"
          />
        </td>
        <td>${selectedStaffMember.name}</td>
        <td>${selectedStaffMember.surname}</td>
        <td>${selectedStaffMember.email}</td>
        <td>${selectedStaffMember.status}</td>
        <td>${selectedStaffMember.outTime || ""}</td>
        <td>${selectedStaffMember.duration || ""}</td>
        <td>${selectedStaffMember.expectedReturnTime || ""}</td>
      `);

      // Update the row's data attribute
      $(selectedRow).data("staffMember", JSON.stringify(selectedStaffMember));
    }
  }
}

//Delivery Driver information is manually entered into input elements in the Delivery Driver table. The table is populated with the Delivery Driver object data.
//(There must be an addDelivery function that adds the delivery driver’s information to the Delivery Board table)

class addDelivery {
  constructor() {
    this.deliveryBoardTable = document
      .getElementById("deliveryBoard")
      .querySelector("tbody"); // Reference to the delivery board table body
    this.deliveryDrivers = [];
  }

  createDeliveryDriver() {
    // Fetch form values
    const vehicle = document.querySelector("#scheduleDelivery select").value;
    const name = document.querySelector("#scheduleDelivery input[placeholder='Enter name']").value.trim();
    const surname = document.querySelector("#scheduleDelivery input[placeholder='Enter surname']").value.trim();
    const phone = document.querySelector("#scheduleDelivery input[placeholder='Enter phone number']").value.trim();
    const address = document.querySelector("#scheduleDelivery input[placeholder='Enter delivery address']").value.trim();
    const returnTime = document.querySelector("#scheduleDelivery input[type='time']").value;
  
    // Log the returnTime for debugging
    console.log(`Return Time Entered: ${returnTime}`);
  
    // Input validation
    if (!name || !surname || !phone || !address || !returnTime) {
      alert("Please fill in all fields.");
      return;
    }
  
    // Combine current date with returnTime
    const currentDate = new Date(); // Get the current date
    const [hours, minutes] = returnTime.split(":"); // Split returnTime into hours and minutes
    const combinedReturnTime = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      parseInt(hours),
      parseInt(minutes),
      0
    );
  
    if (isNaN(combinedReturnTime)) {
      console.error("Invalid combined return time.");
      alert("Please enter a valid return time.");
      return;
    }
  
    // Create a new DeliveryDriver object
    const newDriver = new DeliveryDriver(
      name,
      surname,
      vehicle,
      phone,
      address,
      combinedReturnTime.toISOString() // Store in ISO format
    );
  
    // Log the created driver for debugging
    console.log("Created Delivery Driver:", newDriver);
  
    // Add the new driver to the array
    this.deliveryDrivers.push(newDriver);
  
    // Add a new row to the delivery board
    this.addRowToDeliveryBoard(newDriver);
  
    // Check if the new driver is late
    newDriver.deliveryDriverIsLate();
  }
  

  addRowToDeliveryBoard(deliveryDriver) {
    let vehicleIcon =
      deliveryDriver.vehicle === "Car"
        ? `<i class="fas fa-car"></i>` // Font Awesome car icon
        : `<i class="fas fa-motorcycle"></i>`; // Font Awesome motorbike icon
  
    // Parse the ISO string to a Date object
    const returnTime = new Date(deliveryDriver.returnTime);
  
    // Format the time as hh:mm
    const formattedTime = returnTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // Use 24-hour format
    });
  
    const newRow = document.createElement("tr");
  
    newRow.innerHTML = `
      <td class="text-center">${vehicleIcon}</td>
      <td class="text-center">${deliveryDriver.name}</td>
      <td class="text-center">${deliveryDriver.surname}</td>
      <td class="text-center">${deliveryDriver.telephone}</td>
      <td class="text-center">${deliveryDriver.deliveryAddress}</td>
      <td class="text-center">${formattedTime}</td> <!-- Display formatted time -->
    `;
  
    // Attach data-deliveryDriver to the row
    $(newRow).data("deliveryDriver", JSON.stringify(deliveryDriver));
  
    // Append the new row to the delivery board table
    this.deliveryBoardTable.appendChild(newRow);
  }
  
}

class DeliveryRowSelector {
  constructor(tableSelector, deliveryManagerInstance) {
    this.table = $(tableSelector); // Reference to the delivery table
    this.deliveryManager = deliveryManagerInstance; // Reference to the delivery manager instance
    this.selectedRow = null; // Track the currently selected row
    this.bindEvents(); // Initialize event bindings
  }

  bindEvents() {
    // Use event delegation to handle dynamically added rows
    this.table.on("click", "tbody tr", (event) => this.handleRowClick(event));

    // Document-wide click event to deselect rows
    $(document).on("click", (event) => this.handleOutsideClick(event));
  }

  handleRowClick(event) {
    event.stopPropagation(); // Prevent the document-level handler from triggering

    const clickedRow = $(event.currentTarget);

    // Toggle selection for the clicked row
    if (this.selectedRow && this.selectedRow[0] === clickedRow[0]) {
      // Deselect if the same row is clicked
      this.selectedRow.removeClass("bg-success");
      this.selectedRow = null;
      this.deliveryManager.selectedDeliveryDriver = null;
    } else {
      // Deselect the previously selected row, if any
      if (this.selectedRow) {
        this.selectedRow.removeClass("bg-success");
      }

      // Select the new row
      this.selectedRow = clickedRow;
      this.selectedRow.addClass("bg-success");

      // Store the delivery driver data
      const deliveryDriverData = this.selectedRow.data("deliveryDriver");
      if (deliveryDriverData) {
        this.deliveryManager.selectedDeliveryDriver =
          JSON.parse(deliveryDriverData);
      } else {
        console.error("No data-deliveryDriver found for the selected row.");
      }
    }
  }

  handleOutsideClick(event) {
    // Deselect the row if clicking anywhere on the page
    if (this.selectedRow) {
      this.selectedRow.removeClass("bg-success");
      this.selectedRow = null;
      this.deliveryManager.selectedDeliveryDriver = null;
    }
  }
}

class clearDriver {
  constructor(rowSelector) {
    this.rowSelector = rowSelector; // Reference to the row selector
  }

  execute() {
    const selectedRow = this.rowSelector.selectedRow;

    if (!selectedRow) {
      alert("Please select a driver to clear.");
      return;
    }

    const confirmClear = confirm(
      "Are you sure you want to clear the selected driver?"
    );
    if (confirmClear) {
      // Remove the row from the table
      selectedRow.remove();

      // Clear the selected row and object from the row selector
      this.rowSelector.selectedRow = null;
      this.rowSelector.deliveryManager.selectedDeliveryDriver = null;

      alert("The selected driver has been cleared.");
    }
  }
}

// The current Date and Time should be updated every second (basically a digital clock) in the specified format (Day, Month, Year, Hour:Minute: Second”. E.g. 5 June 2022 14:54:22 or 05-06-2022 14:54:22
//(There must be a digitalClock function)
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
setInterval(digitalClock, 1000);

$(document).ready(() => {
  const staffManager = new staffUserGet();
  staffManager.getUsers();

  // Check for late staff every minute
  setInterval(() => {
    staffManager.checkAllLateStaff();
  }, 60000);

  // Initialize the row selector after the table is populated
  const rowSelector = new StaffRowSelector("#staffTable", staffManager);

  // Bind the "Out" button to the staffOut function
  $("#out-button").on("click", () => {
    const outHandler = new staffOut(rowSelector);
    outHandler.execute();
  });

  // Bind the "In" button to the staffIn function
  $("#in-button").on("click", () => {
    const inHandler = new staffIn(rowSelector);
    inHandler.execute();
  });

  const deliveryHandler = new addDelivery();

  // Bind the "Add" button click event to create a delivery driver
  $("#addDeliveryBtn").on("click", () => {
    deliveryHandler.createDeliveryDriver();
  });

  const deliveryRowSelector = new DeliveryRowSelector(
    "#deliveryBoard",
    deliveryHandler
  );

  // Initialize the clearDriver class
  const clearHandler = new clearDriver(deliveryRowSelector);

  // Bind the "Clear" button to the clearDriver functionality
  $("#clear-button").on("click", () => {
    clearHandler.execute();
  });
  // Check for late staff every minute
  setInterval(() => {
    staffManager.checkAllLateStaff();
  }, 10000);

  // Periodically check for late delivery drivers
  setInterval(() => {
    if (
      deliveryHandler.deliveryDrivers &&
      deliveryHandler.deliveryDrivers.length > 0
    ) {
      deliveryHandler.deliveryDrivers.forEach((driver) => {
        driver.deliveryDriverIsLate(); // Check each driver's lateness
      });
    } else {
      console.log("No delivery drivers to check.");
    }
  }, 10000); // Check every minute
});
