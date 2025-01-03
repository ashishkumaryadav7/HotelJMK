const urlParams = new URLSearchParams(window.location.search);

// Extract data
const firstName = urlParams.get("booking-first-name");
const lastName = urlParams.get("booking-last-name");
const arrival = urlParams.get("booking-arival");
const departure = urlParams.get("booking-departure");
const gadults = urlParams.get("booking-adults");
const gchildren = urlParams.get("booking-children");

const first_name = document.querySelector("input[name=booking-first-name]");
if (firstName) first_name.value = firstName;
const last_name = document.querySelector("input[name=booking-last-name]");
if (lastName) last_name.value = lastName;
const arrival_date = document.querySelector("input[name=booking-arival]");
if (arrival) arrival_date.value = arrival;
const departure_date = document.querySelector("input[name=booking-departure]");
if (departure) departure_date.value = departure;
const adults = document.querySelector("select[name=booking-adults]");
if (gadults) adults.value = gadults;
const children = document.querySelector("select[name=booking-children]");
if (gchildren) children.value = gchildren;
