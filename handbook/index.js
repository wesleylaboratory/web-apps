import { useHandbookApi } from './apis/handbook.api.js';
import { encodeHtmlString, highlightMatchingText } from './utils/string.util.js';

(async () => {
    let allFiles = [];

    // Set event listener for search input
    const searchElem = document.querySelector('#file-search');
    searchElem.addEventListener('input', (evt) => onInputTrigger(evt, allFiles));

    // Go fetch handbook file list
    const { getHandbookFilesFromIndex } = useHandbookApi();
    toggleSearchLoading(true);
    const handbookFilesArrayResponse = await getHandbookFilesFromIndex();
    toggleSearchLoading(false);

    allFiles = Array.isArray(handbookFilesArrayResponse) ? handbookFilesArrayResponse : [];
    allFiles.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
})();

/**
 * Takes in input event and updates DOM
 * @param {Event} inputEvent
 * @returns {void}
 */
function onInputTrigger(inputEvent, allFiles) {
    /** @type {any} */
    const eventTarget = inputEvent.target;
    const searchTerm = eventTarget.value?.trim();

    const filterList = filteredListBySearch(searchTerm, allFiles);
    updateDomList(searchTerm, filterList);
    updateDomResultsCount(searchTerm, filterList);
}

/**
 * Toggles search loading spinner
 * @param {boolean} isLoading
 * @returns {void}
 */
function toggleSearchLoading(isLoading) {
    const searchIcon = document.querySelector('#file-search-icon');
    const searchIconLoading = document.querySelector('#file-search-icon-loading');

    if (isLoading) {
        searchIcon.classList.add('d-none');
        searchIconLoading.classList.remove('d-none');
    } else {
        searchIconLoading.classList.add('d-none');
        searchIcon.classList.remove('d-none');
    }
}

/**
 * Returns a filtered list of handbook file items based on search term.
 * @param {string | null | undefined} value 
 * @param {Array<IHandbookFile>} list 
 * @returns {Array<IHandbookFile>}
 */
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

/**
 * Manages updating the DOM with filtered list items.
 * @param {string | null | undefined} searchTerm
 * @param {Array<IHandbookFile>} filteredList  
 * @returns {void}
 */
function updateDomList(searchTerm, filteredList) {
    const unorderedListElem = document.querySelector('#handbook-files');
    unorderedListElem.innerHTML = '';

    if (filteredList.length <= 0) {
        unorderedListElem.classList.add('d-none');
    } else {
        unorderedListElem.classList.remove('d-none');
    }

    for (const file of filteredList) {
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'list-group-item-action', 'p-0');

        const encodedStr = `
            <a target="_blank" href="${file.url}" class="d-block text-decoration-none fw-bold text-black px-3 py-2">
                ${highlightMatchingText(searchTerm, encodeHtmlString(file.name))}
            </a>
        `;

        li.innerHTML = encodedStr;
        unorderedListElem.appendChild(li);
    }
}

/**
 * Manages updating the DOM with an updated results count.
 * @param {string | null | undefined} searchTerm
 * @param {Array<IHandbookFile>} filteredList  
 * @returns {void}
 */
function updateDomResultsCount(searchTerm, filteredList) {
    const resultsCountElem = document.querySelector('#results-count');
    if (searchTerm.length <= 0) {
        resultsCountElem.classList.add('d-none');
    } else {
        resultsCountElem.classList.remove('d-none');
        if (filteredList.length > 0) {
            const pluralisedResultLabel = filteredList.length === 1 ? 'result' : 'results';
            resultsCountElem.innerHTML = `${filteredList.length} ${pluralisedResultLabel} found.`;
        } else {
            resultsCountElem.innerHTML = 'No results found matching search.';
        }
    }
}
