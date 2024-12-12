// Combined method for row selection and deselection
  selectEmployee() {
    $(document).on("click", (e) => {
      const clickedRow = $(e.target).closest("tr"); // Get the clicked row (if any)

      // If the clicked element is part of a row
      if (clickedRow.length && clickedRow.closest("table")[0] === this.table[0]) {
        // Deselect the previous row if any
        if (this.selectedStaffRow && this.selectedStaffRow[0] !== clickedRow[0]) {
          this.selectedStaffRow.removeClass("bg-success");
        }

        // Toggle selection for the clicked row
        if (this.selectedStaffRow && this.selectedStaffRow[0] === clickedRow[0]) {
          this.selectedStaffRow.removeClass("bg-success");
          this.selectedStaffRow = null;
        } else {
          this.selectedStaffRow = clickedRow;
          this.selectedStaffRow.addClass("bg-success");
        }
      } else {
        // Deselect the row if clicked outside the table
        if (this.selectedStaffRow) {
          this.selectedStaffRow.removeClass("bg-success");
          this.selectedStaffRow = null;
        }
      }
    });