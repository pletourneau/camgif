// Function to request media devices and list them
function initCameras() {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      // Stop the stream as we just need permission to list devices
      stream.getTracks().forEach((track) => track.stop());
      listDevices();
    })
    .catch((error) => console.error("Access denied for media devices", error));
}

// Function to list devices and initialize cameras
function listDevices() {
  navigator.mediaDevices
    .enumerateDevices()
    .then((devices) => {
      devices.forEach((device) => {
        console.log(
          device.kind + ": " + device.label + " id = " + device.deviceId
        );
      });

      // Initialize cameras with their device IDs
      // Replace the placeholders with actual device IDs
      getCameraStream(
        "camera1",
        "05babc06839fbf6ea94fb63b0745fa86d8de0b5af437bba1449ab6ceea64b2c1"
      );
      getCameraStream(
        "camera2",
        "37224b2fc0fe1619124c93955d854ca2869b52ab0e214be7ae5e8021d0f67288"
      );
      getCameraStream(
        "camera3",
        "774172ba3eca115de25e022206c0f7da29abe6ec91952d5ac2c14b865cdc4eb1"
      );
    })
    .catch((err) => console.error("Error listing devices: ", err));
}

// Function to get a specific camera stream using device ID
function getCameraStream(videoElementId, deviceId) {
  navigator.mediaDevices
    .getUserMedia({ video: { deviceId: deviceId } })
    .then(function (stream) {
      document.getElementById(videoElementId).srcObject = stream;
    })
    .catch(function (error) {
      console.log("Error accessing camera:", error);
    });
}

// Function to capture from a specific camera
function captureCamera(videoElementId, canvasElementId) {
  var video = document.getElementById(videoElementId);
  var canvas = document.getElementById(canvasElementId);
  var context = canvas.getContext("2d");
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
}

// Event listener for the zoom in button
// document.getElementById("zoomInButton").addEventListener("click", function () {
//   var videoElement = document.getElementById("camera1");
//   videoElement.classList.toggle("zoomedIn");
// });

// Event listener for the capture button
document.getElementById("capture").addEventListener("click", function () {
  captureCamera("camera1", "canvas1");
  captureCamera("camera2", "canvas2");
  captureCamera("camera3", "canvas3"); // Capture for the third camera
});

// Function to create GIF from canvas elements
function createGif() {
  console.log("Starting GIF creation...");
  const gif = new GIF({
    workers: 2,
    quality: 10,
    width: 640,
    height: 480,
    workerScript: "./gif.worker.js",
  });

  // Add each canvas to the GIF
  const canvasIds = ["canvas1", "canvas2", "canvas3"];
  canvasIds.forEach((id) => {
    const canvas = document.getElementById(id);
    gif.addFrame(canvas, { delay: 400 }); // Adjust delay as needed
  });

  // Once the GIF is rendered, do something with it
  gif.on("finished", function (blob) {
    console.log("GIF creation finished.");
    // For example, display the GIF in an image element
    const imgElement = document.getElementById("gifDisplay");
    imgElement.src = URL.createObjectURL(blob);

    // Or download the GIF
    const link = document.createElement("a");
    link.href = imgElement.src;
    link.download = "animated.gif";
    link.click();
  });

  // Start creating the GIF
  gif.render();
}

// Add event listener to your capture button to create the GIF
document.getElementById("capture").addEventListener("click", function () {
  createGif();
});

// Initialize the cameras
initCameras();
