document.getElementById("upload").addEventListener("click", () => {
  document.getElementById("fileInput").click();
});

// Handle the selected file
document.getElementById("fileInput").addEventListener("change", (event) => {
  const file = event.target.files[0];

  if (file) {
    console.log("User selected:", file.name);
    // Add your metadata logic here
  }
});