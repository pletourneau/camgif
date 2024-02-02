// Function to request media devices and list them
function initCameras() {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
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
        "98beae500dbe08a5179ae8b1c68a9b15ec9ad4dc42f1d8d08c547ccefca5ee98"
      );
      getCameraStream(
        "camera2",
        "c4dd208261649697580e27da3a4b6960754b87c800ee583e0d18b0e7e40afd20"
      );
      getCameraStream(
        "camera3",
        "c3d1ed7ed4f820251844385eec8bbe4b6e96f761249316e707642000988abaf6"
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

// Event listener for the capture button
document.getElementById("capture").addEventListener("click", function () {
  captureCamera("camera1", "canvas1");
  captureCamera("camera2", "canvas2");
  captureCamera("camera3", "canvas3");
});

// Function to create GIF from canvas elements
function createGif() {
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

// Function to capture from cameras with a delay for bullet time effect
// function captureBulletTime() {
//   const delays = [0, 100, 200]; // Delays in milliseconds
//   const canvasIds = ["canvas1", "canvas2", "canvas3"];
//   const videoIds = ["camera1", "camera2", "camera3"];

//   videoIds.forEach((videoId, index) => {
//     setTimeout(() => {
//       captureCamera(videoId, canvasIds[index]);
//     }, delays[index]);
//   });

//   // Delay GIF creation to ensure all captures are complete
//   setTimeout(createGif, delays[delays.length - 1] + 100); // Adjust the delay as needed
// }

// Add event listener to your capture button to create the GIF
document.getElementById("capture").addEventListener("click", function () {
  createGif();
});

// document
//   .getElementById("captureBulletTime")
//   .addEventListener("click", captureBulletTime);

// Initialize the cameras
initCameras();
