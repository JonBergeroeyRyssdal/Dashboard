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
        ${vehicle}&nbsp
        <strong class="me-auto">${name} ${surname}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">
        Delivery driver ${name} ${surname} is ${minutesLate} minute(s) late. <br>
        Phone number: ${phone} <br>
        Delivery adress: ${address} <br>
        Expected return time: ${returnTime}
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