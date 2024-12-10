const staffTable = $("#staffTable");

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
    outTime = "",
    duration = "",
    expectedReturnTime = null,
    staffMemberIsLate = false
  ) {
    super(name, surname);
    this.picture = picture;
    this.email = email;
    this.status = status;
    this.outTime = outTime;
    this.duration = duration;
    this.expectedReturnTime = expectedReturnTime;
    this.staffMemberIsLate = staffMemberIsLate;
  }
}

class StaffTable {
  constructor(tableSelector) {
    this.table = $(tableSelector);
    this.selectedStaffRow = null;

    // Bind event listeners
    this.bindRowClickEvent();
    this.bindDocumentClickEvent();
  }

  // Method to add rows to the table
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
        <td>${staffMember.outTime}</td>
        <td>${staffMember.duration}</td>
        <td>${staffMember.expectedReturnTime || ""}</td>
      </tr>`;
    this.table.append(row);
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

// Initialize the table
const staffTableInstance = new StaffTable("#staffTable");

// Function to fetch staff users and populate the table
function staffUserGet() {
  $.ajax({
    url: "https://randomuser.me/api/?results=5",
    dataType: "json",
    success: function (data) {
      const users = data.results;

      // Create StaffMember objects and add rows
      users.forEach((user) => {
        const staffMember = new StaffMember(
          user.name.first,
          user.name.last,
          user.picture.thumbnail,
          user.email
        );
        staffTableInstance.addRow(staffMember);
      });
    },
    error: function (error) {
      console.error("Error fetching users:", error);
    },
  });
}

// Fetch and populate the table
staffUserGet();

// "Out" button
function staffOut() {
  const selectedStaffRow = staffTableInstance.selectedStaffRow;
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
  } else {
    alert("Invalid input. Please enter a positive number.");
  }
}

// Attach the staffOut function to the "Out" button
$("#out-button").on("click", staffOut);

// "In" button
function staffIn() {
  const selectedStaffRow = staffTableInstance.selectedStaffRow;
  if (!selectedStaffRow) {
    alert("Please select a staff member.");
    return;
  }

  // Update the selected staff member's information
  selectedStaffRow.find("td").eq(4).text("In");
  selectedStaffRow.find("td").eq(5).text("");
  selectedStaffRow.find("td").eq(6).text("");
  selectedStaffRow.find("td").eq(7).text("");

  // Clear the selection
  selectedStaffRow.removeClass("bg-success");
  staffTableInstance.selectedStaffRow = null;
}

// Attach the staffIn function to the "In" button
$("#in-button").on("click", staffIn);