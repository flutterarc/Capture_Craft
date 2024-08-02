// *********************** CAMERA **********************************

const cameraBtn = document.querySelector('.camera');
const recordBtn = document.querySelector('.record');
let isRecording = false;
cameraBtn.addEventListener('click', cameraUIHandler);

let isCameraOpen = false;
let cameraContainer = null;
let mediaRecorder;
let recordedBlobs;
const mediaArray = [];
const recyclebinArray = [];

function cameraUIHandler() {

    if (isCameraOpen) {
        cameraContainer.remove();
        isCameraOpen = false;
        return;
    }

    isCameraOpen = true;

    cameraContainer = document.createElement('div');
    const cameraNavBar = document.createElement('div');
    const minimize = document.createElement('div');
    const close = document.createElement('div');
    const videoContainer = document.createElement('video');
    const recordBtn = document.createElement('button');
    const captureBtn = document.createElement('button');
    const captureIcon = document.createElement('img');
    const recordIcon = document.createElement('img');
    const rec_and_cap_container = document.createElement('div');
    const cameraText = document.createElement('h2');

    cameraText.setAttribute('class', 'text');
    cameraContainer.setAttribute('class', 'camera-container');
    cameraNavBar.setAttribute('class', 'navBar');
    minimize.setAttribute('class', 'minimize');
    close.setAttribute('class', 'close');
    rec_and_cap_container.setAttribute('class', 'rec_and_cap_container');
    videoContainer.setAttribute('class', 'video');
    recordBtn.setAttribute('id', 'record');
    captureBtn.setAttribute('id', 'capture');
    captureIcon.setAttribute('class', 'captureIcon');
    recordIcon.setAttribute('class', 'recordIcon');

    cameraText.innerText = 'CAMERA';
    recordIcon.src = "./icons/record.png"
    recordIcon.alt = "record-icon"
    captureIcon.src = "./icons/capture.png"
    captureIcon.alt = "capture-icon";

    cameraNavBar.appendChild(cameraText);
    cameraNavBar.appendChild(minimize);
    cameraNavBar.appendChild(close);
    recordBtn.appendChild(recordIcon);
    captureBtn.appendChild(captureIcon);
    rec_and_cap_container.appendChild(recordBtn);
    rec_and_cap_container.appendChild(captureBtn);
    cameraContainer.appendChild(cameraNavBar);
    cameraContainer.appendChild(videoContainer);
    cameraContainer.appendChild(rec_and_cap_container);
    document.body.appendChild(cameraContainer);

    //NAV BAR FUNCTIONALITIES
    let isMinimized = false;
    minimize.addEventListener("click", function () {

        if (isMinimized == false) {
            videoContainer.style.display = "none";
            rec_and_cap_container.style.display = "none"

            videoContainer.style.backgroundColor = "inherit";
            cameraContainer.style.backgroundColor = "inherit";
        } else {
            videoContainer.style.display = "block";
            rec_and_cap_container.style.display = "flex";

            videoContainer.style.backgroundColor = "#2e92d5";
            cameraContainer.style.backgroundColor = "whitesmoke";
        }
        isMinimized = !isMinimized;
    });

    close.addEventListener("click", function () {
        cameraContainer.remove();
        isCameraOpen = false;
    });

    moveContainer(cameraNavBar, cameraContainer);
    startCamera();
}
async function startCamera() {
    const video = document.querySelector('.video');
    const captureBtn = document.querySelector('#capture');
    const recordBtn = document.querySelector('#record');
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        video.srcObject = stream;
        video.play();

        captureBtn.addEventListener('click', captureImage);

        recordBtn.addEventListener('click', () => {
            if (!isRecording) {
                startRecording(stream);
                console.log("isRecording:", isRecording);
            } else {
                stopRecording(stream);
                console.log("isRecording STOP RECORDING:", isRecording);
            }
            isRecording = !isRecording;
        });

        console.log("isRecording OUTSIDE:", isRecording);
        // recordBtn.addEventListener('click', async () => {
        //     if (isRecording) {
        //         await startRecording(stream);
        //     } else {
        //         stopRecording(stream);
        //     }
        //     isRecording = !isRecording;
        // });

    } catch (error) {
        alert('Error accessing camera. Please make sure your camera is plugged in and available.');
    }
}
function captureImage() {
    const video = document.querySelector('.video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const imgAndVidContainer = document.querySelector('.img-vid-container');

    canvas.width = 200;
    canvas.height = 200;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/png');

    const capturedImageContainer = document.createElement('div');
    const capturedImage = document.createElement('img');
    const deleteBtn = document.createElement('button');

    capturedImageContainer.setAttribute('class', 'captured-image-container');
    capturedImage.setAttribute('class', 'captured-image');
    deleteBtn.setAttribute('class', 'delete-button');

    deleteBtn.textContent = "Delete";
    capturedImage.src = imageData;

    // Append
    capturedImageContainer.appendChild(capturedImage);
    capturedImageContainer.appendChild(deleteBtn);
    imgAndVidContainer.appendChild(capturedImageContainer);

    //Add image to mediaArray
    mediaArray.push({
        src: imageData,
        type: 'image',
        deleted: false
    });

    deleteBtn.addEventListener('click', () => {
        moveMediaToRecycleBin(imageData, capturedImageContainer, 'image');
        completelyDeleteImage(imageData, capturedImageContainer);
    });

    //store mediaArray in localStorage
    storeMedia();
}

async function startRecording(stream) {
    const recordIcon = document.querySelector('.recordIcon'); 
    try {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start(1000);
        recordedBlobs = [];

        mediaRecorder.ondataavailable = function (e) {
            if (e.data.size > 0) {
                recordedBlobs.push(e.data);
            }
        }
        console.log("STARTING TO RECORD");

        recordIcon.src = "../icons/recordStop.png"
    } catch (error) {
        console.log("THERE IS AN ERROR:", error);
        // alert('Error starting recording:', error);
    }
}
function stopRecording(stream) {
    const recordIcon = document.querySelector('.recordIcon');
    const imgAndVidContainer = document.querySelector('.img-vid-container');

    recordIcon.src = "../icons/record.png";

    if (mediaRecorder) { // Check if mediaRecorder is not null
        mediaRecorder.stop();
        stream.getTracks().forEach((track) => {
            track.enabled = false; // Disable the track
            track.stop(); // Stop the track
        });
        const superBuffer = new Blob(recordedBlobs, { type: 'video/webm' });

        const recordedVideoContainer = document.createElement('div');
        const recordedVideo = document.createElement('video');
        const deleteButton = document.createElement('button');

        recordedVideoContainer.setAttribute('class', 'recorded-video-container');
        recordedVideo.setAttribute('class', 'recorded-video');
        deleteButton.setAttribute('class', 'delete-button');
        deleteButton.textContent = 'Delete';

        recordedVideo.width = 200;
        recordedVideo.height = 200;
        recordedVideo.src = URL.createObjectURL(superBuffer);
        recordedVideo.controls = true; // Add controls to the video

        recordedVideoContainer.appendChild(recordedVideo);
        recordedVideoContainer.appendChild(deleteButton);
        imgAndVidContainer.appendChild(recordedVideoContainer);

        deleteButton.addEventListener('click', () => {
            moveMediaToRecycleBin(recordedVideo.src, recordedVideoContainer, 'video');
            recordedVideoContainer.remove();
        });
        mediaArray.push({
            src: recordedVideo.src,
            type: 'video',
            deleted: false
        })

        mediaRecorder = null;
        recordedBlobs = [];
        storeMedia();
        startCamera();
        console.log("Recording stopped")
    }
}
function moveMediaToRecycleBin(src, mediaContainer, type) {
    const recycledContainer = document.querySelector('.recycled-images-vids');
    const recycledMediaContainer = document.createElement('div');
    let recycledMedia;
    const recycleDeleteBtn = document.createElement('button');
    const recycleRestoreBtn = document.createElement('button');

    mediaContainer.innerHTML = '';

    if (type === 'image') {
        recycledMedia = document.createElement('img');
        recycledMedia.setAttribute('class', 'recycled-img');
        recycledMedia.src = src;
    } else if (type === 'video') {
        recycledMedia = document.createElement('video');
        recycledMedia.setAttribute('class', 'recycled-video');
        recycledMedia.src = src;
        recycledMedia.controls = true;
    }

    recycleRestoreBtn.setAttribute('class', 'recycleRestoreBtn');
    recycleDeleteBtn.setAttribute('class', 'recycleDeleteBtn');
    recycledMediaContainer.setAttribute('class', 'recycledMediaContainer');
    recycleDeleteBtn.textContent = 'Delete';
    recycleRestoreBtn.textContent = 'Restore';

    recycledMediaContainer.appendChild(recycledMedia);
    recycledMediaContainer.appendChild(recycleDeleteBtn);
    recycledMediaContainer.appendChild(recycleRestoreBtn);
    recycledContainer.appendChild(recycledMediaContainer);

    // Add event listener to recycle delete button
    recycleDeleteBtn.addEventListener('click', () => {
        deleteMediaFromLocalStorage(src, type);
        recycledMediaContainer.remove();
    });
    recycleRestoreBtn.addEventListener('click', () => {
        restoreMedia(src, recycledMediaContainer, type);
    });

    // Move media to recycle bin
    const index = mediaArray.findIndex((media) => media.src === src);
    if (index !== -1) {
        mediaArray[index].deleted = true;
    }
    storeMedia();
}
function deleteMediaFromLocalStorage(src, type) {
    const storedMedia = JSON.parse(localStorage.getItem('media'));
    const index = storedMedia.findIndex((media) => media.src === src && media.type === type);
    if (index !== -1) {
        storedMedia.splice(index, 1);
        localStorage.setItem('media', JSON.stringify(storedMedia));
    }

    // Remove media data from mediaArray
    const indexInMediaArray = mediaArray.findIndex((media) => media.src === src && media.type === type);
    if (indexInMediaArray !== -1) {
        mediaArray.splice(indexInMediaArray, 1);
    }
}
function restoreMedia(src, recycledMediaContainer, type) {
    const imgAndVidContainer = document.querySelector('.img-vid-container');
    const mediaContainer = document.createElement('div');
    let mediaElement;
    const deleteBtn = document.createElement('button');

    if (type === 'image') {
        mediaContainer.setAttribute('class', 'captured-image-container');
        mediaElement = document.createElement('img');
        mediaElement.setAttribute('class', 'captured-image');
    } else if (type === 'video') {
        mediaContainer.setAttribute('class', 'recorded-video-container');
        mediaElement = document.createElement('video');
        mediaElement.setAttribute('class', 'recorded-video');
        mediaElement.controls = true;
    }

    deleteBtn.setAttribute('class', 'delete-button');
    deleteBtn.textContent = 'Delete';
    mediaElement.src = src;

    mediaContainer.appendChild(mediaElement);
    mediaContainer.appendChild(deleteBtn);
    imgAndVidContainer.appendChild(mediaContainer);

    deleteBtn.addEventListener('click', () => {
        moveMediaToRecycleBin(src, mediaContainer, type);
    });

    // Remove media container from recycle bin
    recycledMediaContainer.remove();

    // Update mediaArray to reflect that the media is no longer deleted
    const index = mediaArray.findIndex((media) => media.src === src && media.type === type);
    if (index !== -1) {
        mediaArray[index].deleted = false;
    }

    // Store updated mediaArray in local storage
    storeMedia();
}
//store images in local storage that is being called when image is captured and stopped recording 
function storeMedia() {
    localStorage.setItem('media', JSON.stringify(mediaArray));
}
//When the page gets reload this function will be called
function renderMedia() {
    const imgAndVidContainer = document.querySelector('.img-vid-container');
    const recycledContainer = document.querySelector('.recycled-images-vids');
    const storedMedia = JSON.parse(localStorage.getItem('media')) || [];

    storedMedia.forEach((media) => {
        const mediaContainer = document.createElement('div');
        let mediaElement;
        const deleteBtn = document.createElement('button');

        if (media.type === 'image') {
            mediaContainer.setAttribute('class', 'captured-image-container');
            mediaElement = document.createElement('img');
            mediaElement.setAttribute('class', 'captured-image');
        } else if (media.type === 'video') {
            mediaContainer.setAttribute('class', 'recorded-video-container');
            mediaElement = document.createElement('video');
            mediaElement.setAttribute('class', 'recorded-video');
            mediaElement.controls = true;
        }

        deleteBtn.setAttribute('class', 'delete-button');
        deleteBtn.textContent = 'Delete';
        mediaElement.src = media.src;

        mediaContainer.appendChild(mediaElement);
        mediaContainer.appendChild(deleteBtn);

        if (!media.deleted) {
            imgAndVidContainer.appendChild(mediaContainer);

            deleteBtn.addEventListener('click', () => {
                moveMediaToRecycleBin(media.src, mediaContainer, media.type);
            });
        } else {
            const recycledMediaContainer = document.createElement('div');
            const recycleDeleteBtn = document.createElement('button');
            const recycleRestoreBtn = document.createElement('button');

            recycleDeleteBtn.setAttribute('class', 'recycleDeleteBtn');
            recycleRestoreBtn.setAttribute('class', 'recycleRestoreBtn');
            recycledMediaContainer.setAttribute('class', 'recycledMediaContainer');
            recycleDeleteBtn.textContent = 'Delete';
            recycleRestoreBtn.textContent = 'Restore';

            recycledMediaContainer.appendChild(mediaElement);
            recycledMediaContainer.appendChild(recycleDeleteBtn);
            recycledMediaContainer.appendChild(recycleRestoreBtn);
            recycledContainer.appendChild(recycledMediaContainer);

            recycleDeleteBtn.addEventListener('click', () => {
                deleteMediaFromLocalStorage(media.src, media.type);
                recycledMediaContainer.remove();
            });
            recycleRestoreBtn.addEventListener('click', () => {
                restoreMedia(media.src, recycledMediaContainer, media.type);
            });
        }

        mediaArray.push(media);
    });
}

// Completely delete image function
function completelyDeleteImage(imageData, capturedImageContainer) {
    capturedImageContainer.remove();
}

//When window gets reload, render the previousely saved images back to gallery
window.onload = function () {
    renderMedia();
}