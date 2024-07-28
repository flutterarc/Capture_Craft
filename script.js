// ************ COMMON FUNCTIONALITIES *****************
function moveContainer(navBar, container) {
    let initialX = null;
    let initialY = null;
    let isMove = false;
    // console.log("intitialX:",initialX);
    // console.log("intitialY:",initialY);

    navBar.addEventListener("mousedown", function (e) {
        // console.log("MouseDown triggered");
        initialX = e.clientX;
        initialY = e.clientY;
        isMove = true;
        // console.log("MouseDown isMove", isMove);
    });

    navBar.addEventListener("mousemove", function (e) {
        // console.log("MouseMove triggered");
        // console.log("MouseMove isMove", isMove);
        if (isMove === true) {
            // console.log(container, ":moving");
            let finalX = e.clientX;
            let finalY = e.clientY;

            let diffX = finalX - initialX;
            let diffY = finalY - initialY;

            let { top, left } = container.getBoundingClientRect();

            container.style.top = top + diffY + "px";
            container.style.left = left + diffX + "px";

            initialX = finalX;
            initialY = finalY;
        }
    });

    navBar.addEventListener("mouseup", function () {
        // console.log("MouseUp triggered");
        isMove = false;
        // console.log("MouseUp isMove", isMove);
    });
    // pointer => moved off container
    navBar.addEventListener("mouseleave", function () {
        // console.log("mouseLeave triggered");
        isMove = false;
        // console.log("mouseLeave isMove", isMove);
    });
}

// ************* TIMER *************************************
const timeEle = document.querySelector('#time');

function updateTime() {
    const now = new Date();
    const hours = now.getHours();
    const minute = now.getMinutes();
    const seconds = now.getSeconds();
    timeEle.textContent = `${hours}:${minute}:${seconds}`;
}

setInterval(updateTime, 1000);
updateTime();

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
    const imageContainer = document.querySelector('.image-container');

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

        recordedVideoContainer.setAttribute('class','recorded-video-container');
        recordedVideo.setAttribute('class','recorded-video');
        deleteButton.setAttribute('class','delete-button');
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
        imageContainer.appendChild(recordedVideoContainer);

        mediaRecorder = null;
        // recordedBlobs = null;
        startCamera();
        console.log("inside stop recording")
    }
}

function captureImage() {
    const video = document.querySelector('.video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const imageContainer = document.querySelector('.image-container');

    canvas.width = 200;
    canvas.height = 200;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/png');

    const capturedImageContainer = document.createElement('div');
    const capturedImage = document.createElement('img');
    const deleteBtn = document.createElement('button');

    capturedImageContainer.setAttribute('class','captured-image-container');
    capturedImage.setAttribute('class','captured-image');
    deleteBtn.setAttribute('class','delete-button');

    deleteBtn.textContent = "Delete";
    capturedImage.src = imageData;

    deleteBtn.addEventListener('click',()=>{
        capturedImageContainer.remove();
    })

    // Append
    capturedImageContainer.appendChild(capturedImage);
    capturedImageContainer.appendChild(deleteBtn);
    imageContainer.appendChild(capturedImageContainer);
}

// *********************** GALLERY **************************

const galleryContainer = document.querySelector('.gallery-container');
const galleryBtn = document.querySelector('.gallery');
const imageContainer = document.querySelector('.image-container');
const minimize = document.querySelector('.minimize');
const close = document.querySelector('.close-gallery');
const galleryNavBar = document.querySelector('.gallery-navBar')
let isMinimized = false;

// Initially hide the gallery container
galleryContainer.style.display = 'none';
galleryBtn.addEventListener('click', GalleryUI);

minimize.addEventListener("click", function () {
    if (isMinimized == false) {
        imageContainer.style.display = "none";
        imageContainer.style.backgroundColor = "inherit";
    } else {
        imageContainer.style.display = "flex";
        imageContainer.style.backgroundColor = "whitesmoke";
    }
    isMinimized = !isMinimized;
});

close.addEventListener("click", function () {
    galleryContainer.style.display = 'none';
})

function GalleryUI() {
    // Toggle the display of the gallery container
    if (galleryContainer.style.display === 'none') {
        galleryContainer.style.display = 'flex';

        moveContainer(galleryNavBar, galleryContainer);

    } else {
        galleryContainer.style.display = 'none';
    }
}



// ********************** RECYCLE-BIN *************************
const recycleBinBtn = document.querySelector('.recycle-bin');
const recycleBinContainer = document.querySelector('.recycle-container');
const recycleMinimize = document.querySelector('.minimize-recycle');
const recycleClose = document.querySelector('.close-recycle');
const recycleImageContainer = document.querySelector('.recycle-images');
const recycleNavBar = document.querySelector('.recycle-navBar');

// Initially hide the recycle-bin container
recycleBinContainer.style.display = 'none';

recycleBinBtn.addEventListener('click', recycleBinUI);

function recycleBinUI() {
    if (recycleBinContainer.style.display === 'none') {
        recycleBinContainer.style.display = 'flex';

        moveContainer(recycleNavBar, recycleBinContainer);
    } else {
        recycleBinContainer.style.display = 'none';
    }
}
let isRecycleMinimized = false;
recycleMinimize.addEventListener("click", function () {
    if (isRecycleMinimized == false) {
        recycleImageContainer.style.visibility = "none";
        recycleImageContainer.style.backgroundColor = "inherit";
    } else {
        recycleImageContainer.style.visibility = "flex";
        recycleImageContainer.style.backgroundColor = "whitesmoke";
    }
    isRecycleMinimized = !isRecycleMinimized;
});
recycleClose.addEventListener("click", function () {
    recycleBinContainer.style.display = 'none';
})
