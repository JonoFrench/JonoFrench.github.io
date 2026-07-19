class SiteHeader extends HTMLElement {

    connectedCallback() {

        this.innerHTML = `

<header class="site-header">

    <div class="site-header-container">

        <div class="brand">
            <div class="brand-text">
                <h1>
                    Jonathan French
                </h1>
                <p>
                    Apps • Games • Code
                </p>
            </div>
            </div>

            <div class="brand-scene">
                <img
                class="brand-illustration"
                src="../apps/assets/images/desk.png"
                alt="Jonathan French">
            </div>
        

        <nav class="main-nav">

            <a href="/apps/">

                Apps

            </a>

            <a href="/blog/">

                Blog

            </a>

            <a href="/about/">

                About

            </a>

            <a href="/support/">

                Support

            </a>

        </nav>

        <button
            class="theme-button"
            aria-label="Toggle Theme">

            ☀︎

        </button>

    </div>

</header>

`;

    }

}

customElements.define(
    "site-header",
    SiteHeader
);