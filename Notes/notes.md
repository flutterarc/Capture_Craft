# About

* Highlevel  - 
    * users can record himself, click images,
    * gallery app, when image is downloaded goes into gallery
    * when image is deleted goes into recycle bin.
    * When image is deleted even from recycle bin, deleted forever.
    * When clicked on restored the, image goes back to gallery .


### Learning

## Canvas
* Canvas :The Canvas API provides a means for drawing graphics via JavaScript and the HTML <canvas> element. Among other things, it can be used for animation, game graphics, data visualization, photo manipulation, and real-time video processing.
* Used canvas for image manipulation

* INDEX
* To find the coordinates on screen
  * clientX -> from the visible area, how much pixels away am i from , from that point where I clicked, (left most side sea nhi toh top sea measure krta hea)
  * pageX -> this measures from the beginning of the page(left most side or top)
  * screenX -> measures from the whole screen, even if you decrease the container size
  * offsetX -> yea joh container ka hisab sea dkta hea.. substracting the space in between.


## Container when click come to top wala code
* 1.set a default z-index value
* 2.Higher the z-index value, that container will come to top


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
* 1.Local storage size limit: local storage has a maximum size limit of 5MB. If you try to store too many images, you may exceed this limit and the images may not be stored correctly.
* 2.Security: Local storage is not secure, so you should not store sensitive information (like user data or authentication tokens) in local storage.
