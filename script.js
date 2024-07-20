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

// **********************************************************************

// *********************** CAMERA **********************************

const camera = document.querySelector('.camera');

function cameraUIHandler() {
    console.log("inside")
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
    const record = document.createElement('img');
    const capture = document.createElement('img');
    record.className = "record";
    capture.className = "capture";
    record.src = "./icons/record.png"
    record.alt = "record-icon"
    capture.src = "./icons/capture.png"
    capture.alt = "capture-icon";
    recordingContainer.appendChild(record);
    recordingContainer.appendChild(capture);

    //Appned rest of child
    // cameraContainer.appendChild(filterContainer);
    cameraContainer.appendChild(video);
    cameraContainer.appendChild(recordingContainer);

    document.querySelector('.body').appendChild(cameraContainer);

    // Make the camera container draggable and resizable
    cameraDrag(cameraContainer);
    startCamera();
}

function cameraDrag(container) {
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
        console.log("finalX:", finalX)

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

