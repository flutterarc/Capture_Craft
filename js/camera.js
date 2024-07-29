// *********************** CAMERA **********************************

const cameraBtn = document.querySelector('.camera');
const recordBtn = document.querySelector('.record');

cameraBtn.addEventListener('click', cameraUIHandler);

let isCameraOpen = false;
let cameraContainer = null;
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

    recordIcon.src = "./icons/record.png"
    recordIcon.alt = "record-icon"
    captureIcon.src = "./icons/capture.png"
    captureIcon.alt = "capture-icon";

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

let mediaRecorder;
let recordedBlobs;
async function startCamera() {
    const video = document.querySelector('.video');
    const captureBtn = document.querySelector('#capture');
    const recordBtn = document.querySelector('#record');

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        video.srcObject = stream;
        video.play();

        captureBtn.addEventListener('click', captureImage);

        // When record button is clicked, start/stop recording
        let isRecording = false;


        recordBtn.addEventListener('click', () => {
            if (!isRecording) {
                startRecording(stream);
            } else {
                stopRecording(stream);
            }
            isRecording = !isRecording;
        });

    } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Error accessing camera. Please make sure your camera is plugged in and available.');
    }
}
// Start recording
async function startRecording(stream) {

    try {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start(1000);
        recordedBlobs = [];

        mediaRecorder.ondataavailable = function (e) {
            if (e.data.size > 0) {
                recordedBlobs.push(e.data);
            }
        }
    } catch (error) {
        alert('Error starting recording:', error);
    }
}
// Stop recording
function stopRecording(stream) {
    const imgAndVidContainer = document.querySelector('.img-vid-container');

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
        recordedVideo.play();

        deleteButton.addEventListener('click', () => {
            console.log("delete clicked")
            recordedVideoContainer.remove();
        });

        recordedVideoContainer.appendChild(recordedVideo);
        recordedVideoContainer.appendChild(deleteButton);
        imgAndVidContainer.appendChild(recordedVideoContainer);

        mediaRecorder = null;
        // recordedBlobs = null;
        startCamera();
        console.log("inside stop recording")
    }
}


// WHEN IMAGE CAPTURED STORE IN AN ARRAY WALA CODE
//Phase 1- initialization
const imagesArray = [];
const recyclebinArray = [];

//PHASE 2: Image Capture
//In this phase when we click the capture btn, image gets shown in gallery and we store the image in array, but when we refresh the page, the gallery becomes empty , so we have to re-render the image from stored images gallery. For that we need phase-4;
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

    //Add image to imagesArray
    imagesArray.push({
        src: imageData,
        deleted: false
    })

    deleteBtn.addEventListener('click', () => {
        moveImageToRecycleBin(imageData, capturedImageContainer);
    });

    //store imagesArray in localStorage
    storeImages();
}
function moveImageToRecycleBin(imageData, capturedImageContainer) {
    const recycledContainer = document.querySelector('.recycled-images-vids');
    const recycledImageContainer = document.createElement('div');
    const recycledImage = document.createElement('img');
    const recycleDeleteBtn = document.createElement('button');
    const recycleRestoreBtn = document.createElement('button');

    capturedImageContainer.innerHTML = '';
    recycledImage.setAttribute('class', 'recycled-img')
    recycleRestoreBtn.setAttribute('class', 'recycleRestoreBtn')
    recycleDeleteBtn.setAttribute('class', 'recycleDeleteBtn');
    recycledImageContainer.setAttribute('class', 'recycledImageContainer');
    recycleDeleteBtn.textContent = 'Delete';
    recycleRestoreBtn.textContent = 'Restore';
    recycledImage.src = imageData;

    recycledImageContainer.appendChild(recycledImage);
    recycledImageContainer.appendChild(recycleDeleteBtn);
    recycledImageContainer.appendChild(recycleRestoreBtn);
    recycledContainer.appendChild(recycledImageContainer);

    // Add event listener to recycle delete button
    recycleDeleteBtn.addEventListener('click', () => {
        deleteImageFromLocalStorage(imageData);
        recycledImageContainer.remove();
    });
    recycleRestoreBtn.addEventListener('click', () => {
        restoreImage(imageData, recycledImageContainer);
    });
}
function deleteImageFromLocalStorage(imageData) {
    const storedImages = JSON.parse(localStorage.getItem('images'));
    const index = storedImages.findIndex((image) => image.src === imageData);
    if (index !== -1) {
        storedImages.splice(index, 1);
        localStorage.setItem('images', JSON.stringify(storedImages));
    }

    // Remove image data from imagesArray
    const indexInImagesArray = imagesArray.findIndex((image) => image.src === imageData);
    if (indexInImagesArray !== -1) {
        imagesArray.splice(indexInImagesArray, 1);
    }
}
// Phase 3: Image Restoration
function restoreImage(imageData, recycledImageContainer) {
    const imgAndVidContainer = document.querySelector('.img-vid-container');
    const capturedImageContainer = document.createElement('div');
    const capturedImage = document.createElement('img');
    const deleteBtn = document.createElement('button');

    capturedImageContainer.setAttribute('class', 'captured-image-container');
    capturedImage.setAttribute('class', 'captured-image');
    deleteBtn.setAttribute('class', 'delete-button');

    deleteBtn.textContent = "Delete";
    capturedImage.src = imageData;

    capturedImageContainer.appendChild(capturedImage);
    capturedImageContainer.appendChild(deleteBtn);
    imgAndVidContainer.appendChild(capturedImageContainer);

    deleteBtn.addEventListener('click', () => {
        moveImageToRecycleBin(imageData, capturedImageContainer);
    });

    // Remove image container from recycle bin
    recycledImageContainer.remove();

    // Update imagesArray to reflect that the image is no longer deleted
    const index = imagesArray.findIndex((image) => image.src === imageData);
    if (index !== -1) {
        imagesArray[index].deleted = false;
    }

    // Store updated imagesArray in local storage
    storeImages();
}
//PHASE 3: Image Storage
//store images in local storage taht is being called when captureImage function is called
function storeImages() {
    localStorage.setItem('images', JSON.stringify(imagesArray));
}

//Phase-4: Image Rendering
//When the page gets reload this function will be called
function renderImages() {
    const imgAndVidContainer = document.querySelector('.img-vid-container');

    imagesArray.forEach((image) => {
        const capturedImageContainer = document.createElement('div');
        const capturedImage = document.createElement('img');
        const deleteBtn = document.createElement('button');

        capturedImageContainer.setAttribute('class', 'captured-image-container');
        capturedImage.setAttribute('class', 'captured-image');
        deleteBtn.setAttribute('class', 'delete-button');

        deleteBtn.textContent = "Delete";
        capturedImage.src = image.src;

        capturedImageContainer.appendChild(capturedImage);
        capturedImageContainer.appendChild(deleteBtn);
        imgAndVidContainer.appendChild(capturedImageContainer);
    })
}

//PHASE-5: Image Deletion
// Completely delete image function
function completelyDeleteImage(imageData, capturedImageContainer) {
    // Remove image container from recycle bin
    capturedImageContainer.remove();
}