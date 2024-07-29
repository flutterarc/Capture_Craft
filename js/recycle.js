// ********************** RECYCLE-BIN *************************
const recycleBinBtn = document.querySelector('.recycle-bin');
const recycleBinContainer = document.querySelector('.recycle-container');
const recycleMinimize = document.querySelector('.minimize-recycle');
const recycleClose = document.querySelector('.close-recycle');
const recycledContainer = document.querySelector('.recycled-images-vids');
const recycleNavBar = document.querySelector('.recycle-navBar');
const recycleDeleteBtn = document.querySelector('.recycleDeleteBtn');

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
        recycledContainer.style.visibility = "none";
        recycledContainer.style.backgroundColor = "inherit";
    } else {
        recycledContainer.style.visibility = "flex";
        recycledContainer.style.backgroundColor = "whitesmoke";
    }
    isRecycleMinimized = !isRecycleMinimized;
});
recycleClose.addEventListener("click", function () {
    recycleBinContainer.style.display = 'none';
})
