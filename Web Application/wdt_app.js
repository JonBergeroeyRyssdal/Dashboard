// ----------Classes----------

// Parent
class Employee {
  constructor(name, surname) {
    this.name = name;
    this.surname = surname;
  }
}

// Child 1
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
    const currentTime = new Date();
    const expectedReturnTime = new Date(this.expectedReturnTime);

    if ((currentTime - expectedReturnTime) / (1000 * 60) > 1) {
      // Convert milliseconds to minutes
      const minutesLate = Math.floor(
        (currentTime - expectedReturnTime) / (1000 * 60)
      ); // Calculate minutes late
      const toastElement = document.createElement("div");

      toastElement.classList.add("toast", "bg-danger", "text-white");
      toastElement.setAttribute("role", "alert");
      toastElement.setAttribute("aria-live", "assertive");
      toastElement.setAttribute("aria-atomic", "true");

      toastElement.innerHTML = `
        <div class="toast-header">
          <img src="${this.picture}" class="rounded me-2" alt="Profile Picture" style="height: 30px; width: 30px;">
          <strong class="me-auto">${this.name} ${this.surname}</strong>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          Staff member ${this.name} ${this.surname} is ${minutesLate} minute(s) late.
        </div>
      `;

      // Append toast to container
      document.querySelector(".toast-container").appendChild(toastElement);

      // Initialize and show toast
      const toast = new bootstrap.Toast(toastElement);
      toast.show();
    }
  }
}

// Child 2
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
    const currentTime = new Date();
    const expectedReturnTime = new Date(this.expectedDeliveryTime);

    if ((currentTime - expectedReturnTime) / (1000 * 60) > 1) {
      // Convert milliseconds to minutes
      const minutesLate = Math.floor(
        (currentTime - expectedReturnTime) / (1000 * 60)
      ); // Calculate minutes late

      const toastElement = document.createElement("div");
      toastElement.classList.add("toast", "bg-warning", "text-black");
      toastElement.setAttribute("role", "alert");
      toastElement.setAttribute("aria-live", "assertive");
      toastElement.setAttribute("aria-atomic", "true");

      toastElement.innerHTML = `
        <div class="toast-header">
          <strong class="me-auto">${this.vehicle}&nbsp${this.name} ${this.surname}</strong>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          Delivery driver ${this.name} ${this.surname} is ${minutesLate} minute(s) late.<br>
          <strong>Phone:</strong> ${this.telephone}<br>
          <strong>Address:</strong> ${this.deliveryAddress}<br>
          <strong>Estimated Return Time:</strong> ${this.returnTime}
        </div>
      `;

      // Append the toast to the toast container
      document.querySelector(".toast-container").appendChild(toastElement);

      // Initialize and show the toast using Bootstrap
      const toast = new bootstrap.Toast(toastElement);
      toast.show();
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
      this.staffMembers = this.createStaffMembers(data.results); // Save staff members
      this.appendToTable(this.staffMembers); // Call function to append to table
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
      const status = "In";
      const outTime = null;
      const duration = null;
      const expectedReturnTime = null;

      return new StaffMember(
        name,
        surname,
        picture,
        email,
        status,
        outTime,
        duration,
        expectedReturnTime
      );
    });
  }

  appendToTable(staffMembers) {
    const tableBody = document.getElementById("staffTable");
    tableBody.innerHTML = ""; // Clear existing rows
    staffMembers.forEach((staffMember) => {
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
        <td>${staffMember.expectedReturnTime || ""}</td>
      `;

      // Set the data-staffMember attribute with the StaffMember object
      $(row).data("staffMember", JSON.stringify(staffMember));

      // Append the row to the table body
      tableBody.appendChild(row);
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

      // Debugging: Log the data attribute
      console.log(
        "Row data-staffMember:",
        this.selectedRow.data("staffMember")
      );

      const staffMemberData = this.selectedRow.data("staffMember");
      if (staffMemberData) {
        this.staffManager.selectedStaffMember = JSON.parse(staffMemberData);
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

    // Calculate hours and minutes for the duration
    const hours = Math.floor(parsedMinutes / 60);
    const minutes = parsedMinutes % 60;
    const formattedDuration = `${hours}h:${minutes
      .toString()
      .padStart(2, "0")}m`;

    // Update staff member's object
    selectedStaffMember.status = "Out";
    selectedStaffMember.outTime = currentTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    selectedStaffMember.duration = formattedDuration;
    selectedStaffMember.expectedReturnTime =
      expectedReturnTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

    // Update the selected row directly
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
        <td>${selectedStaffMember.expectedReturnTime || ""}</td>
      `);

      // Update the row's data attribute
      selectedRow.data("staffMember", JSON.stringify(selectedStaffMember));
    }
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
  }

  createDeliveryDriver() {
    // Fetch form values from the Schedule Delivery HTML form
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

    // Create a new DeliveryDriver object
    const newDriver = new DeliveryDriver(
      name,
      surname,
      vehicle,
      phone,
      address,
      returnTime
    );

    // Add a new row to the delivery board
    this.addRowToDeliveryBoard(newDriver);
  }

  addRowToDeliveryBoard(deliveryDriver) {
    let vehicleIcon = deliveryDriver.vehicle === "Car"
      ? `<i class="fas fa-car"></i>` // Font Awesome car icon
      : `<i class="fas fa-motorcycle"></i>`; // Font Awesome motorbike icon
  
    const newRow = document.createElement("tr");
  
    newRow.innerHTML = `
      <td class="text-center">${vehicleIcon}</td>
      <td class="text-center">${deliveryDriver.name}</td>
      <td class="text-center">${deliveryDriver.surname}</td>
      <td class="text-center">${deliveryDriver.telephone}</td>
      <td class="text-center">${deliveryDriver.deliveryAddress}</td>
      <td class="text-center">${deliveryDriver.returnTime}</td>
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
        this.deliveryManager.selectedDeliveryDriver = JSON.parse(deliveryDriverData);
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

    const confirmClear = confirm("Are you sure you want to clear the selected driver?");
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

  const deliveryRowSelector = new DeliveryRowSelector("#deliveryBoard", deliveryHandler);

  // Initialize the clearDriver class
  const clearHandler = new clearDriver(deliveryRowSelector);

  // Bind the "Clear" button to the clearDriver functionality
  $("#clear-button").on("click", () => {
    clearHandler.execute();
  });
});
