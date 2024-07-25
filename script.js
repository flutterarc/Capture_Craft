
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
let savedImages = []; //This is the array where we will be storing images

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
    const navBar = document.createElement('div');
    const minimize = document.createElement('div');
    const close = document.createElement('div');
    const videoContainer = document.createElement('video');
    const recordBtn = document.createElement('button');
    const captureBtn = document.createElement('button');
    const captureIcon = document.createElement('img');
    const recordIcon = document.createElement('img');
    const rec_and_cap_container = document.createElement('div');

    cameraContainer.setAttribute('class', 'camera-container');
    navBar.setAttribute('class', 'navBar');
    minimize.setAttribute('class', 'minimize');
    close.setAttribute('class', 'close');
    rec_and_cap_container.setAttribute('class', 'rec_and_cap_container');
    videoContainer.setAttribute('class', 'video');
    recordBtn.setAttribute('class', 'record');
    captureBtn.setAttribute('class', 'capture');
    captureIcon.setAttribute('class', 'captureIcon');
    recordIcon.setAttribute('class', 'recordIcon');

    recordIcon.src = "./icons/record.png"
    recordIcon.alt = "record-icon"
    captureIcon.src = "./icons/capture.png"
    captureIcon.alt = "capture-icon";

    navBar.appendChild(minimize);
    navBar.appendChild(close);
    recordBtn.appendChild(recordIcon);
    captureBtn.appendChild(captureIcon);
    rec_and_cap_container.appendChild(recordBtn);
    rec_and_cap_container.appendChild(captureBtn);
    cameraContainer.appendChild(navBar);
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

    //Move container
    let initialX = null;
    let initialY = null;
    let isMove = false;

    navBar.addEventListener("mousedown", function (e) {
        initialX = e.clientX;
        initialY = e.clientY;
        isMove = true;
    });

    navBar.addEventListener("mousemove", function (e) {
        if (isMove === true) {
            let finalX = e.clientX;
            let finalY = e.clientY;

            let diffX = finalX - initialX;
            let diffY = finalY - initialY;

            let { top, left } = cameraContainer.getBoundingClientRect();

            cameraContainer.style.top = top + diffY + "px";
            cameraContainer.style.left = left + diffX + "px";

            initialX = finalX;
            initialY = finalY;
        }
    });

    navBar.addEventListener("mouseup", function () {
        isMove = false;
    });
    // pointer => moved off container
    navBar.addEventListener("mouseleave", function () {
        isMove = false;
    });
}
async function startCamera() {
    const video = document.querySelector('.video');

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (error) {
        console.error('Error accessing camera:', error);
    }
}



// *********************** GALLERY **************************

const galleryContainer = document.querySelector('.gallery-container');
const galleryBtn = document.querySelector('.gallery');
const imageContainer = document.querySelector('.image-container');
const minimize = document.querySelector('.minimize');
const close = document.querySelector('.close-gallery');
const navBar = document.querySelector('.gallery-navBar')
let isMinimized = false;

// Initially hide the gallery container
galleryContainer.style.display = 'none';
galleryBtn.addEventListener('click', toggleGalleryUI);

minimize.addEventListener("click", function () {
    if (isMinimized == false) {
        imageContainer.style.visibility = "none";
        imageContainer.style.backgroundColor = "inherit";
    } else {
        imageContainer.style.visibility = "flex";
        imageContainer.style.backgroundColor = "whitesmoke";
    }
    isMinimized = !isMinimized;
});

close.addEventListener("click", function () {
    galleryContainer.style.display = 'none';
})

function toggleGalleryUI() {
    // Toggle the display of the gallery container
    if (galleryContainer.style.display === 'none') {
        galleryContainer.style.display = 'flex';

        //Move container
        let initialX = null;
        let initialY = null;
        let isMove = false;

        navBar.addEventListener("mousedown", function (e) {
            initialX = e.clientX;
            initialY = e.clientY;
            isMove = true;
        });

        navBar.addEventListener("mousemove", function (e) {
            if (isMove === true) {
                let finalX = e.clientX;
                let finalY = e.clientY;

                let diffX = finalX - initialX;
                let diffY = finalY - initialY;

                let { top, left } = galleryContainer.getBoundingClientRect();

                galleryContainer.style.top = top + diffY + "px";
                galleryContainer.style.left = left + diffX + "px";

                initialX = finalX;
                initialY = finalY;
            }
        });

        navBar.addEventListener("mouseup", function () {
            isMove = false;
        });
        // pointer => moved off container
        navBar.addEventListener("mouseleave", function () {
            isMove = false;
        });

    } else {
        galleryContainer.style.display = 'none';
    }
}

