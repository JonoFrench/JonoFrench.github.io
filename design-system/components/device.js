const devices = {
    iphone: {
        className: "device--iphone"
    },
    ipad: {
        className: "device--ipad"
    },
    appletv: {
        className: "device--appletv"
    }
};

class AppDevice extends HTMLElement {

    connectedCallback() {

        const type = this.getAttribute("type") ?? "iphone";

        const image = this.getAttribute("image") ?? "";

        const alt = this.getAttribute("alt") ?? "";

        this.innerHTML = `

<div class="device ${devices[type]?.className || 'device--iphone'}">

    <div class="phone">

        <div class="phone-frame">

            <div class="dynamic-island">
            </div>
            <div class="phone-screen">

                <img
                    src="${image}"
                    alt="${alt}">

            </div>

            <div class="phone-reflection"></div>

        </div>

    </div>

</div>

`;

        this.initialiseTilt();

    }

    initialiseTilt() {

        const frame =
            this.querySelector(".device-frame");

        const reflection =
            this.querySelector(".device-reflection");

        if (!frame || !reflection)
            return;

        const maxRotation = 4;

        this.addEventListener("mousemove", event => {

            const rect =
                this.getBoundingClientRect();

            const x =
                (event.clientX - rect.left)
                / rect.width;

            const y =
                (event.clientY - rect.top)
                / rect.height;

            const rotateY =
                (x - 0.5) * maxRotation * 2;

            const rotateX =
                (0.5 - y) * maxRotation * 2;

            frame.style.transform =
                `rotateX(${rotateX}deg)
                 rotateY(${rotateY}deg)`;

            reflection.style.transform =
                `translate(
                    ${rotateY * 4}px,
                    ${rotateX * 4}px
                )`;

        });

        this.addEventListener("mouseleave", () => {

            frame.style.transform = "";

            reflection.style.transform = "";

        });

    }

}

customElements.define(
    "app-device",
    AppDevice
);

