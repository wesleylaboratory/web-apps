export function useLaboratoryApi() {
    const baseUrl = 'https://script.google.com/macros/s/AKfycbxlOksq0mEwh1ve6yBnxjEO1W_ai-ypOGvl7da9YQ_WZ3LSyisbTTXln5ayCq086-yy/exec';

    /**
     * @param {string} [query]
     * @param {{limit?: number, page?: number, sort?: number, direction?: string, type?: string}} [options]
     * @returns {boolean}
     */
    async function getHandbookFiles(query, options = null) {
        /** @type {Array<IHandbook>} */
        let handbookRes = [];

        try {
            const params = new URLSearchParams({
                query: (query ?? ''), 
                ...(options ?? {})
            }).toString();
            const res = await fetch(`${baseUrl}?${params}`);
            handbookRes = res.json();
        } catch (e) {
            // Probably show a bootstrap toast message when this happens
            console.error(e);
        } finally {
            return handbookRes;
        }
    }

    return {
        getHandbookFiles
    };
}