import AppData from "../js/app-data.js";

class AppGrid extends HTMLElement {

    async connectedCallback() {

        const apps = await AppData.getAll();

        this.innerHTML = `
            <div class="app-grid"></div>
        `;

        const grid = this.querySelector(".app-grid");

        apps.forEach(app => {

            const card = document.createElement("app-card");

            card.setAttribute("app", app.id);

            grid.appendChild(card);

        });

    }

}

customElements.define("app-grid", AppGrid);