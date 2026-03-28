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


document.getElementById("fileInput").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function(e) {
    const dataURL = e.target.result;

    // Show preview
    const img = document.getElementById("preview");
    img.src = dataURL;
    img.style.display = "block";

    // Load EXIF
    const exif = piexif.load(dataURL);

    // Camera model
    document.getElementById("cameraModel").value =
      exif["0th"][piexif.ImageIFD.Model] || "";

    // Owner name (Artist)
    document.getElementById("ownerName").value =
      exif["0th"][piexif.ImageIFD.Artist] || "";

    // Date created (DateTimeOriginal)
    document.getElementById("dateCreated").value =
      exif["Exif"][piexif.ExifIFD.DateTimeOriginal] || "";

    // Date modified (DateTime)
    document.getElementById("dateModified").value =
      exif["0th"][piexif.ImageIFD.DateTime] || "";

    // GPS coordinates
    const gps = exif["GPS"];
    if (gps) {
      const lat = gps[piexif.GPSIFD.GPSLatitude];
      const lon = gps[piexif.GPSIFD.GPSLongitude];

      document.getElementById("gpsLat").value = lat ? dmsToDecimal(lat) : "";
      document.getElementById("gpsLon").value = lon ? dmsToDecimal(lon) : "";
    }

    document.getElementById("metadataEditor").style.display = "block";
  };

  reader.readAsDataURL(file);
});

// Convert EXIF DMS format to decimal degrees
function dmsToDecimal(dms) {
  const [deg, min, sec] = dms;
  return deg[0] / deg[1] + (min[0] / min[1]) / 60 + (sec[0] / sec[1]) / 3600;
}


document.getElementById("saveMetadataBtn").addEventListener("click", () => {
  const img = document.getElementById("preview");
  const dataURL = img.src;

  const exif = piexif.load(dataURL);

  // Update fields
  exif["0th"][piexif.ImageIFD.Model] =
    document.getElementById("cameraModel").value;

  exif["0th"][piexif.ImageIFD.Artist] =
    document.getElementById("ownerName").value;

  exif["Exif"][piexif.ExifIFD.DateTimeOriginal] =
    document.getElementById("dateCreated").value;

  exif["0th"][piexif.ImageIFD.DateTime] =
    document.getElementById("dateModified").value;

  // GPS (convert decimal back to EXIF rational DMS)
  const lat = parseFloat(document.getElementById("gpsLat").value);
  const lon = parseFloat(document.getElementById("gpsLon").value);

  if (!isNaN(lat) && !isNaN(lon)) {
    exif["GPS"][piexif.GPSIFD.GPSLatitude] = decimalToDms(lat);
    exif["GPS"][piexif.GPSIFD.GPSLongitude] = decimalToDms(lon);
  }

  const exifBytes = piexif.dump(exif);
  const newDataURL = piexif.insert(exifBytes, dataURL);

  // Download updated image
  const link = document.createElement("a");
  link.href = newDataURL;
  link.download = "edited-image.jpg";
  link.click();
});

// Convert decimal degrees to EXIF DMS rational format
function decimalToDms(decimal) {
  const deg = Math.floor(decimal);
  const minFloat = (decimal - deg) * 60;
  const min = Math.floor(minFloat);
  const sec = Math.round((minFloat - min) * 60 * 100);

  return [
    [deg, 1],
    [min, 1],
    [sec, 100]
  ];
}