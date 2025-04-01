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
        updateDomList(filterList, unorderedListElem, searchTerm);

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
    if (!value?.trim()) return [];

    const loweredTrimmedSearch = value.toLowerCase().trim();

    return list.filter(item => {
        const loweredTrimmedName = item.name?.trim().toLowerCase();
        if (!loweredTrimmedName) return false;

        if (loweredTrimmedSearch.length === 1) {
            return loweredTrimmedName.charAt(0) === loweredTrimmedSearch;
        }

        return loweredTrimmedName.includes(loweredTrimmedSearch);
    });
}


function updateDomList(filteredList, unorderedListElem, searchTerm) {
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
        li.classList.add('list-group-item', 'list-group-item-action', 'p-0');

        const formattedDate = file.lastUpdated ? new Date(file.lastUpdated).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        }) : undefined;
        const encodedStr = `
            <a target="_blank" href="${file.url}" class="d-block text-decoration-none fw-bold text-black px-3 py-2">
                ${markMatchingText(searchTerm, encodeHtmlString(file.name))}
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
    const { getHandbookFilesFromIndex } = useHandbookApi();
    const handbookFilesArrayResponse = await getHandbookFilesFromIndex();

    if (Array.isArray(handbookFilesArrayResponse)) {
        return handbookFilesArrayResponse.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    }

    return [];
}


function markMatchingText(searchTerm, textString) {
    if (!searchTerm) return textString;

    const trimmedText = textString.trim();
    if (searchTerm.length === 1 && trimmedText.toLowerCase().charAt(0) === searchTerm.toLowerCase()) {
        return `<mark>${trimmedText.charAt(0)}</mark>${trimmedText.slice(1)}`;
    }

    const safeTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return textString.replace(new RegExp(safeTerm, 'gi'), match => `<mark>${match}</mark>`);
}