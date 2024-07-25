# About

* Highlevel  - 
    * users can record itself, click images,
    * gallery app, when image is downloaded goes into gallery
    * when image is deleted goes into recycle bin.
    * When image is deleted even from recycle bin, deleted forever.
    * When clicked on restored the, image goes back to gallery were it was before.


### Learning
* To find the coordinates on screen
  * clientX -> from the visible area, how much pixels away am i from , from that point where I clicked, (left most side sea nhi toh top sea measyre krta hea)
  * pageX -> this measures from the beginning of the page(left most side or top)
  * screenX -> measures from the whole screen, even if you decrease the container size
    * offsetX -> yea joh container ka hisab sea dkta hea.. substracting the space in between.

## Container when click come to top wala code
* 1.Selecting all containers
* 2.Removing the on-top class from all containers
* 3.Adding the on-top class to the clicked container
* 4.Setting the z-index of the clicked container to a high value using CSS

```js
// Add a class to manage the z-index
function bringToFront(container) {
    // Remove the class from all containers
    const containers = document.querySelectorAll('.camera-container, .gallery-container, .recycle-container');
    containers.forEach((container) => container.classList.remove('on-top'));

    // Add the class to the clicked container
    container.classList.add('on-top');
}

// Add the event listeners
cameraContainer.addEventListener("click", () => bringToFront(cameraContainer));
galleryContainer.addEventListener("click", () => bringToFront(galleryContainer));
recycleBinContainer.addEventListener("click", () => bringToFront(recycleBinContainer));

// Add the CSS for the class
.on-top {
    z-index: 1000; // Set a high z-index value
}