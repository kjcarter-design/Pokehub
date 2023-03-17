function updateTime() {
  var now = new Date();
  var formattedTime = now.toLocaleString("en-US", { timeZone: "UTC", year: "numeric", month: "2-digit", day: "2-digit", hour12: false, hour: "2-digit", minute: "2-digit" });
  document.getElementById("time").textContent = formattedTime;
}

// Update the time every second
setInterval(updateTime, 1000);