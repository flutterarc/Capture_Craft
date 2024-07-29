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