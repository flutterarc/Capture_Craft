// *********************** GALLERY **************************

const galleryContainer = document.querySelector('.gallery-container');
const galleryBtn = document.querySelector('.gallery');
const imgAndVidContainer = document.querySelector('.img-vid-container');
const minimize = document.querySelector('.minimize');
const close = document.querySelector('.close-gallery');
const galleryNavBar = document.querySelector('.gallery-navBar')
let isMinimized = false;

// Initially hide the gallery container
galleryContainer.style.display = 'none';
galleryBtn.addEventListener('click', GalleryUI);

minimize.addEventListener("click", function () {
    if (isMinimized == false) {
        imgAndVidContainer.style.display = "none";
        imgAndVidContainer.style.backgroundColor = "inherit";
    } else {
        imgAndVidContainer.style.display = "flex";
        imgAndVidContainer.style.backgroundColor = "whitesmoke";
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
