class AppNavbar extends HTMLElement {

    connectedCallback() {

        this.innerHTML = `

<header class="site-header">

    <nav class="navbar container">

        <a href="/" class="logo">

            Jonathan French

        </a>

        <ul class="nav-links">

            <li>
                <a href="/#apps">Apps</a>
            </li>

            <li>
                <a href="/support/">Support</a>
            </li>

            <li>
                <a href="https://github.com/"
                   target="_blank"
                   rel="noopener">

                    GitHub

                </a>
            </li>

        </ul>

        <button
            class="theme-button"
            aria-label="Toggle Theme">

            ☀︎

        </button>

    </nav>

</header>

`;

    }

}

customElements.define(
    "app-navbar",
    AppNavbar
);