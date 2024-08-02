// ************ COMMON FUNCTIONALITIES *****************
function moveContainer(navBar, container) {
    let initialX = null;
    let initialY = null;
    let isMove = false;

    navBar.addEventListener("mousedown", function (e) {

        initialX = e.clientX;
        initialY = e.clientY;
        isMove = true;

    });

    navBar.addEventListener("mousemove", function (e) {

        if (isMove === true) {

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
        isMove = false;
    });

    navBar.addEventListener("mouseleave", function () {
        isMove = false;
    });
}
