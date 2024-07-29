// ************ COMMON FUNCTIONALITIES *****************
function moveContainer(navBar, container) {
    let initialX = null;
    let initialY = null;
    let isMove = false;
    // console.log("intitialX:",initialX);
    // console.log("intitialY:",initialY);

    navBar.addEventListener("mousedown", function (e) {
        // console.log("MouseDown triggered");
        initialX = e.clientX;
        initialY = e.clientY;
        isMove = true;
        // console.log("MouseDown isMove", isMove);
    });

    navBar.addEventListener("mousemove", function (e) {
        // console.log("MouseMove triggered");
        // console.log("MouseMove isMove", isMove);
        if (isMove === true) {
            // console.log(container, ":moving");
            let finalX = e.clientX;
            let finalY = e.clientY;

            let diffX = finalX - initialX;
            let diffY = finalY - initialY;

            let { top, left } = container.getBoundingClientRect();

            container.style.top = top + diffY + "px";
            container.style.left = left + diffX + "px";

            initialX = finalX;
            initialY = finalY;
        }
    });

    navBar.addEventListener("mouseup", function () {
        // console.log("MouseUp triggered");
        isMove = false;
        // console.log("MouseUp isMove", isMove);
    });
    // pointer => moved off container
    navBar.addEventListener("mouseleave", function () {
        // console.log("mouseLeave triggered");
        isMove = false;
        // console.log("mouseLeave isMove", isMove);
    });
}
