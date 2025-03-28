export function useHandbookApi() {
    const baseUrl = 'https://script.google.com/macros/s/AKfycbxlOksq0mEwh1ve6yBnxjEO1W_ai-ypOGvl7da9YQ_WZ3LSyisbTTXln5ayCq086-yy/exec';

    /**
     * @param {string} [query]
     * @param {{limit?: number, page?: number, sort?: number, direction?: string, type?: string}} [options]
     * @returns {Promise<IHandbookResponse | undefined>}
     */
    async function getHandbookFiles(query = '', options = null) {
        try {
            const urlParams = new URLSearchParams();
            urlParams.append('query', query);
            
            if (options != null) {
                Object.entries(options).forEach(([key, value]) => {
                    if (value != null) urlParams.append(key, String(value));
                });
            }

            const res = await fetch(`${baseUrl}?${urlParams.toString()}`);

            /** @type {IHandbookResponse} */
            const handbookRes = await res.json();
            return handbookRes;
        } catch (e) {
            console.error(e);
            return;
        }
    }

    /**
     * @returns {Promise<Array<IHandbookFile>>}
     */
    async function getHandbookFilesFromIndex() {
        try {
            const res = await fetch('https://raw.githubusercontent.com/wesleylaboratory/indexed-files/refs/heads/main/handbook/files.json');

            /** @type {Array<IHandbookFile>} */
            const filesRes = await res.json();
            return filesRes;
        } catch(e) {
            console.error(e);
            return [];
        }
    }

    return {
        getHandbookFiles,
        getHandbookFilesFromIndex
    };
}
