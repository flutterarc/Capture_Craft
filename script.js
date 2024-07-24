// ************* COMMON FUNCTIONALITY ********************
function move_container(container) {
    let initialX = null;
    let initialY = null;
    let isDrag = false;

    container.addEventListener('mousedown', (e) => {
        initialX = e.clientX;
        initialY = e.clientY;
        isDrag = true;
    })

    container.addEventListener('mousemove', (e) => {

        if (!isDrag) {
            return;
        }
        let finalX = e.clientX;
        let finalY = e.clientY;
        // console.log("finalX:", finalX)

        let diffX = finalX - initialX;
        let diffY = finalY - initialY;

        let { top, left } = container.getBoundingClientRect();

        container.style.top = top + diffY + "px";
        container.style.left = left + diffX + "px";

        initialX = finalX;
        initialY = finalY;
    })
    container.addEventListener('mouseup', () => {
        isDrag = false;
    })

    //To ensure, if mouse leaves the container, div ko move nhi kr payega
    container.addEventListener('mouseleave', () => {
        isDrag = false;
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

const camera = document.querySelector('.camera');
let savedImages = []; //This is the array where we will be storing images

camera.addEventListener('click', cameraUIHandler);

function cameraUIHandler() {
    const cameraContainer = document.createElement('div');
    const navBar = document.createElement('div');
    const minimize = document.createElement('div');
    const close = document.createElement('div');
    const videoContainer = document.createElement('video');
    const recordBtn = document.createElement('button');
    const captureBtn = document.createElement('button');
    const captureIcon = document.createElement('img');
    const recordIcon = document.createElement('img');
    const rec_and_cap_container = document.createElement('div');
    // const camera_bottom_container = document.createElement('div');

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
    // camera_bottom_container.setAttribute('class','camera_bottom_container');

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
    // camera_bottom_container.appendChild(videoContainer);
    // camera_bottom_container.appendChild(rec_and_cap_container);
    // cameraContainer.appendChild(camera_bottom_container)
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
    });

    move_container(cameraContainer);
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
const galleryUI = document.querySelector('.gallery-container');
const galleryBtn = document.querySelector('.gallery');

// galleryBtn.addEventListener('click', move_container(galleryUI));



