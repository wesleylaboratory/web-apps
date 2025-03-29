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

        const resultsCountElem = document.querySelector('#results-count');
        if (searchTerm.length <= 0) {
            resultsCountElem.classList.add('d-none');
        } else {
            resultsCountElem.classList.remove('d-none');
            if (filterList.length > 0) {
                const pluralisedResultLabel = filterList.length === 1 ? 'result' : 'results';
                resultsCountElem.innerHTML = `${filterList.length} ${pluralisedResultLabel} found.`;
            } else {
                resultsCountElem.innerHTML = 'No results found matching search.';
            }
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

    if (filteredList.length <= 0) {
        unorderedListElem.classList.add('d-none');
    } else {
        unorderedListElem.classList.remove('d-none');
    }

    for (const file of filteredList) {
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'list-group-item-action');

        const formattedDate = file.lastUpdated ? new Date(file.lastUpdated).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        }) : undefined;
        const encodedStr = `
            <a target="_blank" href="${file.url}" class="d-flex flex-row text-decoration-none text-black align-items-center gap-2">
                <div class="d-flex flex-column">
                    <span class="fw-bold">${encodeHtmlString(file.name)}</span>
                    <small class="fw-lighter text-secondary" style="font-size: 13px">${'Updated on ' + formattedDate}</small>
                </div>
            </a>
        `;

        // <span class="material-symbols-outlined text-secondary">docs</span>

        li.innerHTML = encodedStr;
        unorderedListElem.appendChild(li);
    }
}

/**
 * @returns {Promise<Array<IHandbookFile>>}
 */
async function loadFiles() {
    const { getHandbookFilesFromIndex } = useHandbookApi();
    const handbookFilesArrayResponse = await getHandbookFilesFromIndex();

    if (Array.isArray(handbookFilesArrayResponse)) {
        return handbookFilesArrayResponse.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    }

    return [];
}
