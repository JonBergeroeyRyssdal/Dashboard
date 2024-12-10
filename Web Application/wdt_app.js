const staffTable = $("#staffTable");

// ----------Classes----------

// Parent
class Employee {
  constructor(name, surname) {
    this.name = name;
    this.surname = surname;
  }
}

class StaffMember extends Employee {
  constructor(
    name,
    surname,
    picture,
    email,
    status = "In",
    outTime = "",
    duration = "",
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

  staffMemberIsLate() {
    const currentTime = new Date();
    const expectedReturnTime = new Date(this.expectedReturnTime);
  
    if ((currentTime - expectedReturnTime) / (1000 * 60) > 1) { // Convert milliseconds to minutes
      const minutesLate = Math.floor((currentTime - expectedReturnTime) / (1000 * 60)); // Calculate minutes late
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
  constructor(
    name,
    surname,
    vehicle,
    telephone,
    deliveryAddress,
    returnTime,
   
  ) {
    super(name, surname);
    this.vehicle = vehicle;
    this.telephone = telephone;
    this.deliveryAddress = deliveryAddress;
    this.returnTime = returnTime;
  }
  deliveryDriverIsLate() {
    const currentTime = new Date();
    const expectedReturnTime = new Date(this.expectedDeliveryTime);
  
    if ((currentTime - expectedReturnTime) / (1000 * 60) > 1) { // Convert milliseconds to minutes
      const minutesLate = Math.floor((currentTime - expectedReturnTime) / (1000 * 60)); // Calculate minutes late

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

// Class to manage staff table
class staffUserGet {
  constructor(tableSelector) {
    this.table = $(tableSelector); // Bind the table element
    // Bind event listeners
    this.bindRowClickEvent();
    this.bindDocumentClickEvent();
  }

  // Fetch and create employees
  createEmployee() {
    $.ajax({
      url: "https://randomuser.me/api/?results=5",
      dataType: "json",
      success: (data) => {
        const users = data.results;

        // Create StaffMember objects and add rows
        users.forEach((user) => {
          const staffMember = new StaffMember(
            user.name.first,
            user.name.last,
            user.picture.thumbnail,
            user.email
          );
          this.addRow(staffMember); // Use class method
        });
      },
      error: (error) => {
        console.error("Error fetching users:", error);
        alert("Failed to fetch staff data. Please try again later.");
      },
    });
  }

  // Add a staff member row to the table
  addRow(staffMember) {
    const row = `
      <tr>
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
      </tr>`;
    this.table.append(row); // Append to the table
  }

  // Method to handle row selection
    bindRowClickEvent() {
      this.table.on("click", "tr", (event) => {
        const clickedRow = $(event.currentTarget);
  
        // Deselect the previous row
        if (this.selectedStaffRow) {
          this.selectedStaffRow.removeClass("bg-success");
        }
  
        // Toggle selection if the same row is clicked
        if (this.selectedStaffRow && this.selectedStaffRow[0] === clickedRow[0]) {
          this.selectedStaffRow = null;
        } else {
          // Select the new row
          this.selectedStaffRow = clickedRow;
          this.selectedStaffRow.addClass("bg-success");
        }
      });
    }
  
    // Method to deselect row when clicking outside the table
    bindDocumentClickEvent() {
      $(document).on("click", (e) => {
        // If the clicked element is not part of the table, deselect the row
        if (!this.table[0].contains(e.target)) {
          if (this.selectedStaffRow) {
            this.selectedStaffRow.removeClass("bg-success");
            this.selectedStaffRow = null;
          }
        }
      });
    }
  
}

// On page load, initialize and populate the table
$(document).ready(() => {
  const staffTableInstance = new staffUserGet("#staffTable");
  staffTableInstance.createEmployee(); // Fetch and populate on page load
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
