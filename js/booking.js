import CONFIG from "./config.js";

// Event listener for form submission
document
  .querySelector(".bookHotelJMK")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get input field values from HTML form
    const first_name = document.querySelector(
      "input[name=booking-first-name]"
    ).value;
    const last_name = document.querySelector(
      "input[name=booking-last-name]"
    ).value;
    const phone = document.querySelector("input[name=booking-phone]").value;
    const email = document.querySelector("input[name=booking-email]").value;
    const country =
      document.querySelector("select[name=booking-country]").value || "india";

    const address = document.querySelector("input[name=booking-address]").value;
    const arrival_date = formatDate(
      document.querySelector("input[name=booking-arival]").value
    );
    const departure_date = formatDate(
      document.querySelector("input[name=booking-departure]").value
    );
    const adults = parseInt(
      document.querySelector("select[name=booking-adults]").value,
      10
    );
    const children = parseInt(
      document.querySelector("select[name=booking-children]").value,
      10
    );
    const room_type = document.querySelector(
      "select[name=booking-roomtype]"
    ).value;
    const room_category = document.querySelector(
      "select[name=booking-roomcategory]"
    ).value;

    const comments = document.querySelector(
      "textarea[name=booking-comments]"
    ).value;

    // Data to be sent to the server
    const postData = {
      first_name: first_name,
      last_name: last_name,
      phone: phone,
      email: email,
      country: country,
      address: address,
      arrival_date: arrival_date,
      departure_date: departure_date,
      adults: adults,
      children: children,
      room_type: room_type,
      room_category: room_category,
      comments: comments,
    };
    if (arrival_date === departure_date) {
      showNotification(
        "error",
        "Arrival date and departure date cannot be the same."
      );
      return;
    }

    try {
      // Send data to the server using fetch
      const response = await fetch(`${CONFIG.API_BASE_URL}/book-room-online`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });
      if (!response.ok) {
        // Parse the error response from the API
        const errorData = await response.json();

        if (errorData.msg) {
          showNotification("error", errorData.msg);
        } else if (errorData.error) {
          if (Array.isArray(errorData?.error)) {
            showNotification("error", errorData?.error[0]?.msg);
          } else {
            showNotification("error", errorData.msg);
          }
        } else {
          showNotification("error", "Some error occured !");
        }
      } else {
        const data = await response.json();

        showNotification("success", data.msg);
        document
          .querySelectorAll("input, textarea")
          .forEach((input) => (input.value = ""));
        document
          .querySelectorAll("select")
          .forEach((select) => (select.value = ""));
      }
    } catch (error) {
      console.error("Error:", error);
      showNotification("error", "An error occurred while booking the room.");
    }
  });

// Function to show notifications
function showNotification(type, message) {
  const notificationElement = document.createElement("div");
  notificationElement.classList.add("notification", type);

  const icon = type === "error" ? "fa-exclamation" : "fa-check";
  notificationElement.innerHTML = `
    <span class="notification-icon"><i class="fa ${icon}" aria-hidden="true"></i></span>
    <span class="notification-text">${message}</span>
  `;

  const notificationContainer = document.getElementById("notification");
  notificationContainer.appendChild(notificationElement);

  // Hide the notification after 15 seconds
  setTimeout(() => {
    notificationElement.classList.add("scale-out");
    notificationElement.addEventListener("transitionend", () => {
      notificationElement.remove();
    });
  }, 15000);

  // Click to close notification
  notificationElement.addEventListener("click", () => {
    notificationElement.classList.add("scale-out");
  });
}

// Function to call the GET API and load data when the page is loading
async function fetchRoomType() {
  const selectElement = document.getElementById("room-type");
  const roomNotFound = document.getElementById("room-not-found");
  const roomTypeDropDwon = document.getElementById("room-type-dropdown");
  roomNotFound.style.display = "none";


  try {
    // Make the GET API call using fetch and await the response
    const response = await fetch(`${CONFIG.API_BASE_URL}/room-type`);
    // console.log(response);
    if (!response.ok) {
      roomTypeDropDwon.style.display = "none";
      roomNotFound.style.display = "block";
      roomNotFound.value = `some error occured in Room type`;
    }

    const data = await response.json();

    if (data?.result.length > 0) {
      data?.result?.forEach((room) => {
        const option = document.createElement("option");
        option.value = room.room_type;
        option.textContent = `${capitalizeWords(room.room_type)}`;
        selectElement.appendChild(option);
      });
    } else {
      roomTypeDropDwon.style.display = "none";
      roomNotFound.style.display = "block";
      roomNotFound.value = `Room type not found`;
    }
  } catch (error) {
    roomNotFound.style.display = "block";
    roomTypeDropDwon.style.display = "none";
    roomNotFound.value = `some error occured in Room type`;
  }
}
async function fetchRoomCategory() {
  const selectCategoryElement = document.getElementById("room-category");
  const roomCategoryNotFound = document.getElementById("category-not-found");
  const roomCategoryDropDwon = document.getElementById(
    "room-category-dropdown"
  );
  roomCategoryNotFound.style.display = "none";

  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}/room-category`);
    if (!response.ok) {
      roomCategoryDropDwon.style.display = "none";
      roomCategoryNotFound.style.display = "block";
      roomCategoryNotFound.value = `some error occured in Room Category`;
    }

    const data = await response.json();

    if (data?.result.length > 0) {
      data?.result?.forEach((room) => {
        const option = document.createElement("option");
        option.value = room.category_type;
        option.textContent = `${capitalizeWords(room.category_type)}`;
        selectCategoryElement.appendChild(option);
      });
    } else {
      roomCategoryDropDwon.style.display = "none";
      roomCategoryNotFound.style.display = "block";
      roomCategoryNotFound.value = `Room Category not found`;
    }
  } catch (error) {
    roomCategoryNotFound.style.display = "block";
    roomCategoryDropDwon.style.display = "none";
    roomCategoryNotFound.value = `some error occured in Room Category`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fetchRoomType();
  fetchRoomCategory();

});

function capitalizeWords(input) {
  return input
    .toLowerCase() // Ensure the string is in lowercase
    .split(" ") // Split the string by underscores
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
    .join(" "); // Join the words back with spaces
}

function formatDate(dateString) {
  const [day, month, year] = dateString.split("/"); // Assuming the input format is "DD/MM/YYYY"
  return `${year}-${month}-${day}`;
}
