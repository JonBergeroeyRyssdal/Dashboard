$(document).ready(function () {
    const staffTable = $('#staffTable');
  
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
            url: 'https://randomuser.me/api/?results=5',
            dataType: 'json',
            success: function (data) {
                const users = data.results;
                users.forEach(user => {
                    const row = createRow(user);
                    staffTable.append(row);
                });
            },
            error: function (error) {
                console.error('Error fetching users:', error);
            }
        });
    }
  
    // Call the function to load staff users
    staffUserGet();
  });
  
  function updateDateTime() {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const currentDate = new Date();
      const dateString = currentDate.toLocaleDateString('en-US', options);
      const timeString = currentDate.toLocaleTimeString();
  
      document.getElementById("currentDateTime").textContent = `${dateString}, ${timeString}`;
    }
  
    // Call the function to display the date and time when the page loads
    updateDateTime();
  
    // Optional: Update the time every second
    setInterval(updateDateTime, 1000);
  
  