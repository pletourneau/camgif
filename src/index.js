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

      // Initialize cameras with the correct labels
      getCameraStream("camera1", "FaceTime HD Camera (B6DF:451A)");
      getCameraStream("camera2", "USB Camera VID:1133 PID:2085 (046d:0825)");
    })
    .catch((err) => console.error("Error listing devices: ", err));
}

// Function to get a specific camera stream
function getCameraStream(videoElementId, cameraLabel) {
  navigator.mediaDevices
    .enumerateDevices()
    .then(function (devices) {
      var camera = devices.find((device) => device.label === cameraLabel);
      if (camera) {
        navigator.mediaDevices
          .getUserMedia({ video: { deviceId: camera.deviceId } })
          .then(function (stream) {
            document.getElementById(videoElementId).srcObject = stream;
          })
          .catch(function (error) {
            console.log("Error accessing camera:", error);
          });
      }
    })
    .catch(function (error) {
      console.log("Error listing devices:", error);
    });
}

// Function to capture from a specific camera
function captureCamera(videoElementId, canvasElementId) {
  var video = document.getElementById(videoElementId);
  var canvas = document.getElementById(canvasElementId);
  var context = canvas.getContext("2d");
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
}

// Event listener for the capture button
document.getElementById("capture").addEventListener("click", function () {
  captureCamera("camera1", "canvas1");
  captureCamera("camera2", "canvas2");
});

// Initialize the cameras
initCameras();
