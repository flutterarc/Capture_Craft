function cameraUIHandler() {


   
    
   
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
  
    video.autoplay = "true";

   


    // Make the camera container draggable and resizable
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


```js
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

    //When delete button is clicked, put the capturd imaged in recycle bin
    deleteBtn.addEventListener('click', () => {
        const recycledContainer = document.querySelector('.recycled-images-vids');
    
        recycledContainer.appendChild(capturedImageContainer);
        // capturedImageContainer.remove();
    })
}
```