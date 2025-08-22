export function useHandbookApi() {
    /**
     * @returns {Promise<Array<IHandbookFile>>}
     */
    async function getAll() {
        try {
            const res = await fetch('https://wesleylaboratory.github.io/indexed-files/handbook/files.json');

            /** @type {Array<IHandbookFile>} */
            const filesRes = await res.json();
            return filesRes;
        } catch(e) {
            console.error(e);
            return [];
        }
    }

    return {
        getAll
    };
}

