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
    const video = document.createElement('video');
    video.className = "video";
    video.autoplay = "true";

   


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