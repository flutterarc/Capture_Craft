# About

* Highlevel  - 
    * users can record itself, click images,
    * gallery app, when image is downloaded goes into gallery
    * when image is deleted goes into recycle bin.
    * When image is deleted even from recycle bin, deleted forever.
    * When clicked on restored the, image goes back to gallery were it was before.


### Learning
* To find the coordinates on screen
  * clientX -> from the visible area, how much pixels away am i from , from that point where I clicked, (left most side sea nhi toh top sea measyre krta hea)
  * pageX -> this measures from the beginning of the page(left most side or top)
  * screenX -> measures from the whole screen, even if you decrease the container size
    * offsetX -> yea joh container ka hisab sea dkta hea.. substracting the space in between.

### Canvas
* Canvas :The Canvas API provides a means for drawing graphics via JavaScript and the HTML <canvas> element. Among other things, it can be used for animation, game graphics, data visualization, photo manipulation, and real-time video processing.
* Used canvas for image manipulation


## Container when click come to top wala code
* 1.Selecting all containers
* 2.Removing the on-top class from all containers
* 3.Adding the on-top class to the clicked container
* 4.Setting the z-index of the clicked container to a high value using CSS

```js
// Add a class to manage the z-index
function bringToFront(container) {
    // Remove the class from all containers
    const containers = document.querySelectorAll('.camera-container, .gallery-container, .recycle-container');
    containers.forEach((container) => container.classList.remove('on-top'));

    // Add the class to the clicked container
    container.classList.add('on-top');
}

// Add the event listeners
cameraContainer.addEventListener("click", () => bringToFront(cameraContainer));
galleryContainer.addEventListener("click", () => bringToFront(galleryContainer));
recycleBinContainer.addEventListener("click", () => bringToFront(recycleBinContainer));

// Add the CSS for the class
.on-top {
    z-index: 1000; // Set a high z-index value
}
```

## RECORDING USER
* 1.We will create a new "recorder" object that will capture the video and audio from the camera.
    * 2.We tell the recorder to save the captured video and audio in small chunks, like a series of snapshots.
    * 3.Each snapshot is stored in a special container called a "Blob".
    * 4.We collect all these Blobs in an array called "recordedBlobs".
    * 5.As the recorder captures more video and audio, it adds more Blobs to the recordedBlobs array.
    * overall baat joh :we start capturing the video and audio, break it into small chunks, and store these chunks in an array for later  use.
```js
let mediaRecorder;
let recordedBlobs;

function startRecording(stream) {
    recordedBlobs = [];
    mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            recordedBlobs.push(event.data);
        }
    };
    mediaRecorder.start();
}
```


## Storage
* 1.Local storage size limit: As I mentioned earlier, local storage has a maximum size limit of 5MB. If you try to store too many images, you may exceed this limit and the images may not be stored correctly.
* 2.Security: Local storage is not secure, so you should not store sensitive information (like user data or authentication tokens) in local storage.