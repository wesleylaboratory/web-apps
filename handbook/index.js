import { useHandbookApi } from './apis/handbook.api.js';
import { encodeHtmlString } from './utils/string.util.js';

let allFiles = [];

(async () => {
    const unorderedListElem = document.querySelector('#handbook-files');
    const searchElem = document.querySelector('#file-search');
    searchElem.addEventListener('input', (evt) => {
        /** @type {any} */
        const inputEvent = evt;
        const searchTerm = inputEvent.target.value?.trim();

        const filterList = filteredListBySearch(searchTerm, allFiles);
        updateDomList(filterList, unorderedListElem);

        const noResultsElem = document.querySelector('#no-results');
        if (filterList.length <= 0 && searchTerm.length > 0) {
            noResultsElem.classList.remove('d-none');
        } else {
            noResultsElem.classList.add('d-none');
        }
    });

    const searchIcon = document.querySelector('#file-search-icon');
    const searchIconLoading = document.querySelector('#file-search-icon-loading');

    searchIcon.classList.add('d-none');
    searchIconLoading.classList.remove('d-none');
    allFiles = await loadFiles();
    searchIconLoading.classList.add('d-none');
    searchIcon.classList.remove('d-none');
})();


// HELPERS

function filteredListBySearch(value, list) {
    if (value == null || value.trim() === '') {
        return [];
    }

    return list.filter(l => {
        if (value.length === 1) {
            return l.name != null && l.name.trim().toLowerCase().substr(0, 1) === value.toLowerCase();
        } else {
           return l.name != null && l.name.trim().toLowerCase().includes(value.toLowerCase());
        }
    });
}

function updateDomList(filteredList, unorderedListElem) {
    if (unorderedListElem == null) {
        return;
    }

    unorderedListElem.innerHTML = '';

    for (const file of filteredList) {
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'list-group-item-action');

        const encodedStr = `
            <a target="_blank" href="${file.url}" class="text-truncate d-block w-100 h-100">
                ${encodeHtmlString(file.name)}
            </a>
        `;

        li.innerHTML = encodedStr;
        unorderedListElem.appendChild(li);
    }
}

/**
 * @returns {Promise<Array<IHandbookFile>>}
 */
async function loadFiles() {
    const { getHandbookFiles } = useHandbookApi();
    const handbookFilesResponse = await getHandbookFiles('', { limit: 2000 });

    if (handbookFilesResponse != null) {
        return handbookFilesResponse.files.toSorted((a, b) => a.name.localeCompare(b.name));
    }

    return [];
}
