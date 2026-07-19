// ======================================================
// Jonathan French Website
// app-data.js
// Central App Data Service
// ======================================================

 class AppData {

    static #apps = null;
    static #loading = null;

    static async load() {

        if (this.#apps)
            return this.#apps;

        if (this.#loading)
            return this.#loading;

        this.#loading = fetch("assets/data/apps.json")
            .then(response => {
                if (!response.ok)
                    throw new Error(`Failed to load apps.json (${response.status})`);
                return response.json();
            })
            .then(apps => {
                this.#apps = apps;
                this.#loading = null;
                return apps;
            })
            .catch(error => {
                this.#loading = null;
                throw error;
            });

        return this.#loading;
    }

    static async get(id) {

        const apps =
            await this.load();

        return apps.find(
            app => app.id === id
        );

    }

    static async getAll() {

        return await this.load();

    }

}

export default AppData;
