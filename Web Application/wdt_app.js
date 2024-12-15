

// Parent
class Employee {
  constructor(name, surname) {
    this.name = name;
    this.surname = surname;
  }
}

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
      return;
    }

    const currentTime = new Date();
    const expectedReturnTime = new Date(this.expectedReturnTime);
    const timeDifference = (currentTime - expectedReturnTime) / (1000 * 60); // Time difference in minutes

    // Ensure the notification is not repeated
    if (!notifiedStaffMembers[this.email]) {
      notifiedStaffMembers[this.email] = {
        notified: false,
        dismissed: false,
        toastElement: null,
      };
    }

    const staffStatus = notifiedStaffMembers[this.email];

    if (timeDifference > 1 && !staffStatus.notified && !staffStatus.dismissed) {
      staffStatus.notified = true; // Mark as notified

      const minutesLate = Math.floor(timeDifference);

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
          Staff member ${this.name} ${this.surname} is <span class="minutes-late">${minutesLate}</span> minute(s) late.
        </div>
      `;

      const toastContainer = document.querySelector(".toast-container");
      toastContainer.appendChild(toastElement);

      const toast = new bootstrap.Toast(toastElement);
      toast.show();

      // Store the toast element for updates
      staffStatus.toastElement = toastElement;

      // Mark as dismissed if the user closes the toast
      toastElement.addEventListener("hidden.bs.toast", () => {
        staffStatus.dismissed = true;
      });

      // Update the "minutes late" dynamically
      setInterval(() => {
        const currentTime = new Date();
        const timeDifference = (currentTime - expectedReturnTime) / (1000 * 60);
        const updatedMinutesLate = Math.floor(timeDifference);

        const minutesLateElement = toastElement.querySelector(".minutes-late");
        if (minutesLateElement) {
          minutesLateElement.textContent = updatedMinutesLate; // Update the text dynamically
        }
      }, 60000); // Update every minute
    }
  }
}

// Object to track notified and dismissed delivery drivers
const notifiedDeliveryDrivers = {};

// DeliveryDriver Class
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
    if (!this.returnTime) {
      return;
    }

    const currentTime = new Date();
    const expectedReturnTime = new Date(this.returnTime);
    const timeDifference = (currentTime - expectedReturnTime) / (1000 * 60);

    if (!notifiedDeliveryDrivers[this.telephone]) {
      notifiedDeliveryDrivers[this.telephone] = {
        notified: false,
        dismissed: false,
        toastElement: null, // Store a reference to the toast element
      };
    }

    const driverStatus = notifiedDeliveryDrivers[this.telephone];

    if (
      timeDifference > 1 &&
      !driverStatus.notified &&
      !driverStatus.dismissed
    ) {
      driverStatus.notified = true;

      const formattedReturnTime = expectedReturnTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      const vehicleIcon =
        this.vehicle === "Car"
          ? `<i class="fas fa-car"></i>`
          : `<i class="fas fa-motorcycle"></i>`;

      const toastElement = document.createElement("div");
      toastElement.classList.add("toast", "bg-warning", "text-black");
      toastElement.setAttribute("role", "alert");
      toastElement.setAttribute("aria-live", "assertive");
      toastElement.setAttribute("aria-atomic", "true");
      toastElement.setAttribute("data-bs-autohide", "false");

      toastElement.innerHTML = `
        <div class="toast-header">
          <span class="me-2">${vehicleIcon}</span>
          <strong class="me-auto">${this.name} ${this.surname}</strong>
          <button type="button" class="btn-close btn-close-black" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          Delivery driver ${this.name} ${
        this.surname
      } is <span class="minutes-late">${Math.floor(
        timeDifference
      )}</span> minute(s) late.<br>
          <strong>Phone:</strong> ${this.telephone}<br>
          <strong>Address:</strong> ${this.deliveryAddress}<br>
          <strong>Estimated Return Time:</strong> ${formattedReturnTime}
        </div>
      `;

      const toastContainer = document.querySelector(".toast-container");
      toastContainer.appendChild(toastElement);

      const toast = new bootstrap.Toast(toastElement);
      toast.show();

      // Store the toast element for updates
      driverStatus.toastElement = toastElement;

      // Mark as dismissed when the user closes the toast
      toastElement.addEventListener("hidden.bs.toast", () => {
        driverStatus.dismissed = true;
      });

      // Start updating the "minutes late" dynamically
      setInterval(() => {
        const currentTime = new Date();
        const timeDifference = (currentTime - expectedReturnTime) / (1000 * 60);
        const minutesLate = Math.floor(timeDifference);

        const minutesLateElement = toastElement.querySelector(".minutes-late");
        if (minutesLateElement) {
          minutesLateElement.textContent = minutesLate; // Update the text dynamically
        }
      }, 60000); // Update every minute
    }
  }
}

// Renders staff rows. 
class TableUtils {
  static renderRowHtml(staffMember) {
    return `
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
      <td>${staffMember.expectedReturnTime ? new Date(staffMember.expectedReturnTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }) : ""}</td>
    `;
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

  // Fetch staff members from the API
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

  // Create staff member objects
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

  // Append staff members to the table
  appendToTable(staffMembers) {
    const tableBody = document.getElementById("staffTable");
    tableBody.innerHTML = ""; // Clear existing rows

    staffMembers.forEach((staffMember) => {
      const row = document.createElement("tr");

      // Use the renderRowHtml utility function to populate the row's content
      row.innerHTML = TableUtils.renderRowHtml(staffMember);

      // Store the StaffMember object directly in the row's data
      $(row).data("staffMember", staffMember);

      // Append the row to the table body
      tableBody.appendChild(row);
    });
  }

  // Check for late staff members
  checkAllLateStaff() {
    this.staffMembers.forEach((staffMember) => {
      if (staffMember instanceof StaffMember) {
        staffMember.staffMemberIsLate(); // Call the staffMemberIsLate function
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
    this.rowSelector = rowSelector;
  }

  execute() {
    const selectedStaffMember = this.rowSelector.staffManager.selectedStaffMember;

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

    // Format duration
    const hours = Math.floor(parsedMinutes / 60);
    const minutes = parsedMinutes % 60;
    const formattedDuration = `${hours}h:${minutes.toString().padStart(2, "0")}m`;

    // Update the object properties
    selectedStaffMember.status = "Out";
    selectedStaffMember.outTime = currentTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    selectedStaffMember.duration = formattedDuration;
    selectedStaffMember.expectedReturnTime = expectedReturnTime.toISOString(); // Store in ISO format

    // Find the selected row and update its HTML dynamically
    const selectedRow = this.rowSelector.selectedRow;
    if (selectedRow) {
      selectedRow.html(TableUtils.renderRowHtml(selectedStaffMember)); // Update the row
      selectedRow.data("staffMember", selectedStaffMember); // Update the row's data attribute
    }

    // Optionally trigger a late staff check immediately
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
    const selectedStaffMember = this.rowSelector.staffManager.selectedStaffMember;

    if (!selectedStaffMember) {
      alert("Please select a staff member first.");
      return;
    }

    // Update the object properties
    selectedStaffMember.status = "In";
    selectedStaffMember.outTime = null;
    selectedStaffMember.duration = null;
    selectedStaffMember.expectedReturnTime = null;

    // Find the selected row and update its HTML dynamically
    const selectedRow = this.rowSelector.selectedRow;
    if (selectedRow) {
      selectedRow.html(TableUtils.renderRowHtml(selectedStaffMember)); // Update the row
      selectedRow.data("staffMember", selectedStaffMember); // Update the row's data attribute
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
    const name = document
      .querySelector("#scheduleDelivery input[placeholder='Enter name']")
      .value.trim();
    const surname = document
      .querySelector("#scheduleDelivery input[placeholder='Enter surname']")
      .value.trim();
    const phone = document
      .querySelector(
        "#scheduleDelivery input[placeholder='Enter phone number']"
      )
      .value.trim();
    const address = document
      .querySelector(
        "#scheduleDelivery input[placeholder='Enter delivery address']"
      )
      .value.trim();
    const returnTime = document.querySelector(
      "#scheduleDelivery input[type='time']"
    ).value;

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

    // Add the new driver to the array
    this.deliveryDrivers.push(newDriver);

    // Add a new row to the delivery board
    this.addRowToDeliveryBoard(newDriver);

    // Check if the new driver is late
    newDriver.deliveryDriverIsLate();

    // Clear the form fields after successful addition
    this.clearScheduleDeliveryForm();
  }
  clearScheduleDeliveryForm() {
    // Clear all fields in the schedule delivery form
    document.querySelector(
      "#scheduleDelivery input[placeholder='Enter name']"
    ).value = ""; // Clear name
    document.querySelector(
      "#scheduleDelivery input[placeholder='Enter surname']"
    ).value = ""; // Clear surname
    document.querySelector(
      "#scheduleDelivery input[placeholder='Enter phone number']"
    ).value = ""; // Clear phone
    document.querySelector(
      "#scheduleDelivery input[placeholder='Enter delivery address']"
    ).value = ""; // Clear address
    document.querySelector("#scheduleDelivery input[type='time']").value = ""; // Clear time field
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
  setInterval(() => {
    staffManager.checkAllLateStaff();

    if (
      deliveryHandler.deliveryDrivers &&
      deliveryHandler.deliveryDrivers.length > 0
    ) {
      deliveryHandler.deliveryDrivers.forEach((driver) => {
        driver.deliveryDriverIsLate();
      });
    }
  }, 60000); // Run both checks every minute
});
