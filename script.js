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

function cameraUIHandler() {

    //camera container
    const cameraContainer = document.createElement('div');
    cameraContainer.className = "camera-container";

    //Nav bar
    const navBar = document.createElement('div');
    navBar.className = "nav";

    //minimise and close button
    const minimize = document.createElement('div');
    const close = document.createElement('div');
    minimize.className = "minimize";
    close.className = "close";

    navBar.appendChild(minimize);
    navBar.appendChild(close);

    //filter contianer
    // const filterContainer = document.createElement('div');
    // filterContainer.className = "filter-container";

    // //Adding filter 1 to 4 inside filter container
    // for (let i = 1; i <= 4; i++) {
    //     const filterDiv = document.createElement('div');
    //     filterDiv.className = `filter-${i}`;
    //     filterContainer.appendChild(filterDiv);
    // }


    //video element
    const video = document.createElement('video');
    video.className = "video";
    video.autoplay = "true";

    //Container for capture and recording
    const recordingContainer = document.createElement('div');
    recordingContainer.className = "rec_and_click_container";

    //record and capture button;
    const record = document.createElement('button');
    const recordIcon = document.createElement('img');
    record.className = "record";
    recordIcon.className = "recordIcon";
    recordIcon.src = "./icons/record.png"
    recordIcon.alt = "record-icon"

    const capture = document.createElement('button');
    const captureIcon = document.createElement('img');
    capture.className = "capture";
    captureIcon.className = "captureIcon";
    captureIcon.src = "./icons/capture.png"
    captureIcon.alt = "capture-icon";

    recordingContainer.appendChild(record);
    recordingContainer.appendChild(capture);
    capture.appendChild(captureIcon);
    record.appendChild(recordIcon);
    //Append rest of child
    // cameraContainer.appendChild(filterContainer);
    cameraContainer.appendChild(video);
    cameraContainer.appendChild(recordingContainer);

    document.querySelector('body').appendChild(cameraContainer);

    // Make the camera container draggable and resizable
    move_container(cameraContainer);
    startCamera();

    //When capture button is click, we have to capture it and store,
    //Yaha mea dalne sea, null value wont receive

    const captureButton = document.querySelector('.capture');

    // Capture image from the video stream
    captureButton.addEventListener('click', () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageUrl = canvas.toDataURL('image/png');
    
        // Save image to gallery and localStorage
        const img = new Image();
        img.src = imageUrl;
        img.classList.add('gallery-img');  // Add a class for styling
        const gallery = document.querySelector('.gallery-container');
        gallery.appendChild(img);
    
        let savedImages = JSON.parse(localStorage.getItem('gallery')) || [];
        savedImages.push(imageUrl);
        localStorage.setItem('gallery', JSON.stringify(savedImages));
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

camera.addEventListener('click', cameraUIHandler);


// *********************** GALLERY **************************
const galleryUI = document.querySelector('.gallery-container');
const galleryBtn = document.querySelector('.gallery');

galleryBtn.addEventListener('click', move_container(galleryUI));


// 77777777777777777777777
// Capture image from the video stream

