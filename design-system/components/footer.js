class AppFooter extends HTMLElement {

    connectedCallback() {

        this.innerHTML = `
            <footer class="site-footer">

                <div class="container">

                    <div class="footer-top">

                        <div class="footer-brand">

                            <h3>Jonathan French</h3>

                            <p>
                                Independent iOS Developer creating beautiful
                                games and apps for Apple's platforms.
                            </p>

                        </div>

                        <nav class="footer-nav">

                            <a href="/#apps">Apps</a>
                            <a href="/blog/">Blog</a>
                            <a href="/support/">Support</a>

                        </nav>

                    </div>

                    <div class="footer-bottom">

                        <p>
                            © 2026 Jonathan French. All rights reserved.
                        </p>

                    </div>

                </div>

            </footer>
        `;

    }

}

customElements.define("app-footer", AppFooter);
