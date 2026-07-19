// ======================================================
// Jonathan French Website
// app.js
// Main entry point
// ======================================================

document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 Website initialised");
    initialiseNavigation();
    initialiseAnimations();
    initialisePhoneTilt();

});



function initialiseNavigation() {
    console.log("Navigation ready");
}

function initialiseAnimations() {
    console.log("Animations ready");
}

function initialisePhoneTilt() {

    const device = document.querySelector(".device");
    const frame = document.querySelector(".device-frame");
    const reflection = document.querySelector(".device-reflection");

    if (!device || !frame || !reflection) {
        return;
    }

    const maxRotation = 4;

    device.addEventListener("mousemove", (event) => {

        const rect = device.getBoundingClientRect();

        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        const rotateY = (x - 0.5) * maxRotation * 2;
        const rotateX = (0.5 - y) * maxRotation * 2;

        frame.style.transform =
            `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

        reflection.style.transform =
            `translate(${rotateY * 3}px, ${rotateX * 3}px)`;

    });

    device.addEventListener("mouseleave", () => {

        frame.style.transform = "";

        reflection.style.transform = "";

    });

}