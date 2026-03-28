document.getElementById("upload").addEventListener("click", () => {
  document.getElementById("fileInput").click();
});

// Handle the selected file
document.getElementById("fileInput").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  if (file) {
    console.log("User selected:", file.name);
    // Add your metadata logic here
  }
  const reader = new FileReader();

  reader.onload = (e) => {
    const img = document.getElementById("preview");
    img.src = e.target.result;   // Set image source
    img.style.display = "block"; // Make it visible
  };

  reader.readAsDataURL(file);
});