## Recycle bin
```js
let initialX = null;
        let initialY = null;
        let isMove = false;

        recycleNavBar.addEventListener("mousedown", function (e) {
            initialX = e.clientX;
            initialY = e.clientY;
            isMove = true;
        });
        recycleNavBar.addEventListener("mousemove", function (e) {
            if (isMove === true) {
                let finalX = e.clientX;
                let finalY = e.clientY;

                let diffX = finalX - initialX;
                let diffY = finalY - initialY;

                let { top, left } = recycleBinContainer.getBoundingClientRect();

                recycleBinContainer.style.top = top + diffY + "px";
                recycleBinContainer.style.left = left + diffX + "px";

                initialX = finalX;
                initialY = finalY;
            }
        });

        recycleNavBar.addEventListener("mouseup", function () {
            isMove = false;
        });
        // pointer => moved off container
        recycleNavBar.addEventListener("mouseleave", function () {
            isMove = false;
        });