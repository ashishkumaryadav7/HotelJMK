// Get the base path dynamically (useful for subdirectory deployments)
const basePath = window.location.origin;

// List of valid routes
const validRoutes = [
  "/index.html",
  "/standard-room.html",
  "/rooms.html",
  "/restaurant.html",
  "/our-staff.html",
  "/gallery.html",
  "/deluxe-room.html",
  "/contact.html",
  "/booking-form.html",
];

// Function to check the route
const checkRoute = () => {
  // Get the current path
  const currentPath = window.location.pathname;

  // Check if the current path is not valid
  if (!validRoutes.includes(currentPath)) {
    // Redirect to 404.html if invalid
    window.location.href = `${basePath}/404.html`;
  }
};

// Run the check on page load
window.addEventListener("load", checkRoute);
