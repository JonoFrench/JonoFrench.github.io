import AppData from "../js/app-data.js";

class AppCard extends HTMLElement {

    async connectedCallback() {

        const id = this.getAttribute("app");

        if (!id) {
            this.innerHTML = "<p>Missing app id.</p>";
            return;
        }

        const app = await AppData.get(id);

        if (!app) {
            this.innerHTML = `<p>Unknown app: ${id}</p>`;
            return;
        }

        this.render(app);
    }

    render(app) {

        const technologies = (app.technologies ?? [])
            .map(tech => `<span class="technology-pill">${tech}</span>`)
            .join("");

        this.innerHTML = `

<article class="app-card">

    <div class="app-card-device">

        <app-device
            type="iphone"
            image="${app.image}"
            alt="${app.title}">
        </app-device>

    </div>

    <div class="app-card-content">

        <span class="status-badge">
            ${app.status}
        </span>

        <h3>${app.title}</h3>

        <p class="subtitle">
            ${app.subtitle}
        </p>

        <p class="description">
            ${app.description}
        </p>

        <div class="technology-list">

            ${technologies}

        </div>

        <a
            href="${app.url}"
            class="button primary">

            Learn More →

        </a>

    </div>

</article>

`;

    }

}

customElements.define(
    "app-card",
    AppCard
);