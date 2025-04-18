export function useHandbookApi() {
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
        getHandbookFilesFromIndex
    };
}
