// PHASE 1: Initialization
const mediaArray = []; // This will store both images and videos
const recycleBinArray = []; // This will store both deleted images and videos

// PHASE 2: Image Capture
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

    // Add image to mediaArray
    mediaArray.push({
        src: imageData,
        type: 'image',
        deleted: false
    });

    deleteBtn.addEventListener('click', () => {
        moveMediaToRecycleBin(imageData, capturedImageContainer, 'image');
    });

    // Store mediaArray in localStorage
    storeMedia();
}

// PHASE 3: Video Recording
function stopRecording(stream) {
    const imgAndVidContainer = document.querySelector('.img-vid-container');

    if (mediaRecorder) {
        mediaRecorder.stop();
        stream.getTracks().forEach((track) => {
            track.enabled = false;
            track.stop();
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
        recordedVideo.controls = true;

        deleteButton.addEventListener('click', () => {
            moveMediaToRecycleBin(recordedVideo.src, recordedVideoContainer, 'video');
        });

        recordedVideoContainer.appendChild(recordedVideo);
        recordedVideoContainer.appendChild(deleteButton);
        imgAndVidContainer.appendChild(recordedVideoContainer);

        mediaArray.push({
            src: recordedVideo.src,
            type: 'video',
            deleted: false
        });

        mediaRecorder = null;
        startCamera();
        storeMedia();
    }
}

// Common Function to Move Media to Recycle Bin
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

// PHASE 4: Image and Video Storage
function storeMedia() {
    localStorage.setItem('media', JSON.stringify(mediaArray));
}

// When the page gets reload, render the previously saved media
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

// When window gets reloaded, render the previously saved media back to gallery
window.onload = function () {
    renderMedia();
}
