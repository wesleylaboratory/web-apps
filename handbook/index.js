import { useHandbookApi } from './apis/handbook.api.js';
import { encodeHtmlString, highlightMatchingText } from './utils/string.util.js';

(async () => {
    let allFiles = [];
    const searchInputId = 'search-input';
    const filesListId = 'handbook-files-list';

    // DOM elements
    //// Required
    const handbookFilesListEl = document.querySelector(`#${filesListId}`);
    const searchInputEl = /** @type {HTMLInputElement | null} */ (document.querySelector(`#${searchInputId}`));

    //// Other
    const headerImgEl = /** @type {HTMLImageElement | null} */ (document.querySelector('#header-image'));
    const resultCountLabelEl = document.querySelector('#result-count-label');
    const clearResultsButtonEl = document.querySelector('#clear-results-button');
    const loadingIconEl = document.querySelector('#loading-icon');
    const errorLabelEl = /** @type {HTMLElement | null} */ (document.querySelector('#app-error-label'));

    if (searchInputEl == null) {
        showError(`Missing required element with ID: ${searchInputId}`, errorLabelEl);
    }

    if (handbookFilesListEl == null) {
        showError(`Missing required element with ID: ${filesListId}`, errorLabelEl);
    }

    // Check for holiday and set img if needed
    setHeaderImage(headerImgEl);

    // Set event listener for search input
    searchInputEl.addEventListener('input', (evt) => {
        /** @type {any} */
        const eventTarget = evt.target;
        const searchTerm = eventTarget.value?.trim();
        const filterList = filteredListBySearch(searchTerm, allFiles);

        updateDomList(searchTerm, filterList, handbookFilesListEl);
        updateDomResultsCount(searchTerm, filterList, resultCountLabelEl);
        toggleVisibility(searchTerm.length > 0, clearResultsButtonEl);
    });

    // Set event listener for clear search button
    clearResultsButtonEl.addEventListener('click', () => {
        searchInputEl.value = '';
        searchInputEl.dispatchEvent(new Event('input'));
        searchInputEl.focus();
    });

    // Go fetch handbook file list
    const { getAll } = useHandbookApi();
    toggleVisibility(true, loadingIconEl);
    const filesListRes = await getAll();
    toggleVisibility(false, loadingIconEl);

    allFiles = Array.isArray(filesListRes) ? filesListRes : [];
    allFiles.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
})();

/**
 * Shows app error message
 * @param {string} message 
 * @param {HTMLElement | null} labelEl 
 * @returns {void}
 */
function showError(message, labelEl) {
    if (labelEl == null) {
        console.warn('No element found for error label.');
        return;
    };

    labelEl.innerText = message;
    toggleVisibility(true, labelEl);
    console.error(message);
}

/**
 * Sets header image for different holidays
 * @param {HTMLImageElement | null} imgEl 
 * @returns {void}
 */
function setHeaderImage(imgEl) {
    if (imgEl == null) {
        console.warn('No element found for header image.');
        return;
    };

    const defaultImgSrc = './assets/germ-nobg.png';
    const currentYear = new Date().getFullYear();
    const datesToCheck = [
        {
            holiday: 'Halloween',
            start: new Date(`October 27, ${currentYear}, 07:00 AM`),
            end: new Date(`November 01, ${currentYear}, 12:00 AM`),
            imgSrc: './assets/germ-nobg-halloween.png'
        },
        {
            holiday: 'Thanksgiving',
            start: new Date(`November 23, ${currentYear}, 12:00 AM`),
            end: new Date(`December 01, ${currentYear}, 12:00 AM`),
            imgSrc: './assets/germ-nobg-thanksgiving.png'
        },
        {
            holiday: 'ChristmasCountdown',
            start: new Date(`December 01, ${currentYear}, 12:00 AM`),
            end: new Date(`December 25, ${currentYear}, 12:00 AM`),
            imgSrc: './assets/germ-nobg-christmas-countdown.png'
        },
        {
            holiday: 'Christmas',
            start: new Date(`December 25, ${currentYear}, 12:00 AM`),
            end: new Date(`December 28, ${currentYear}, 12:00 AM`),
            imgSrc: './assets/germ-nobg-christmas.png'
        }
    ];

    const now = new Date();
    const holidayToShow = datesToCheck.find(date => now >= date.start && now <= date.end);

    if (holidayToShow) {
        imgEl.src = holidayToShow.imgSrc;

        if (holidayToShow.holiday === 'ChristmasCountdown') {
            setChristmasCountdownVerbiage(imgEl.parentElement);
        }
    } else {
        imgEl.src = defaultImgSrc;
    }
}

/**
 * Sets the verbiage for Christmas countdown image
 * @param {Element} imgContainerEl 
 * @returns {void}
 */
function setChristmasCountdownVerbiage(imgContainerEl) {
    const countdownContainer = document.createElement('div');
    countdownContainer.classList.add('christmas-countdown-sign');
    const currentYear = new Date().getFullYear();
    const christmasMs = new Date(`December 25, ${currentYear}, 12:00 AM`).getTime();
    const diffMs = christmasMs - Date.now();
    const daysTilChristmas = Math.ceil(diffMs / 1000 / 60 / 60 / 24);
    const pluralisedDaysLabel = daysTilChristmas === 1 ? 'DAY' : 'DAYS';
    countdownContainer.innerHTML = `
        <span class="christmas-countdown-sign__days-til">${daysTilChristmas}</span>
        <span>${pluralisedDaysLabel} 'TIL</span>
        <span>CHRISTMAS</span>
    `;

    imgContainerEl.appendChild(countdownContainer);
}

/**
 * Toggles visibility of DOM elem
 * @param {boolean} isVisible
 * @param {Element | null} el
 * @returns {void}
 */
function toggleVisibility(isVisible, el) {
    if (el == null) {
        console.warn('Could not toggle visible state. No element found.');
        return;
    };

    if (isVisible) {
        el.classList.remove('d-none');
    } else {
        el.classList.add('d-none');
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

        const searchTokens = loweredTrimmedSearch.split(' ').filter(t => t);
        return searchTokens.every(token => loweredTrimmedName.includes(token));
    });
}

/**
 * Manages updating the DOM with filtered list items.
 * @param {string | null | undefined} searchTerm
 * @param {Array<IHandbookFile>} filteredList  
 * @returns {void}
 */
function updateDomList(searchTerm, filteredList, unorderedListElem) {
    unorderedListElem.innerHTML = '';
    unorderedListElem.scrollTop = 0;

    if (filteredList.length <= 0) {
        unorderedListElem.classList.add('d-none');
    } else {
        unorderedListElem.classList.remove('d-none');
    }

    for (const file of filteredList) {
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'list-group-item-action', 'p-0');

        const encodedStr = `
            <a target="_blank" href="${file.url}" class="d-block text-decoration-none text-black px-3 py-2">
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
 * @param {Element | null} resultsCountEl
 * @returns {void}
 */
function updateDomResultsCount(searchTerm, filteredList, resultsCountEl) {
    if (resultsCountEl == null) {
        console.warn('No element found for results count.');
        return;
    };

    if (searchTerm.length <= 0) {
        resultsCountEl.classList.remove('d-md-block');
    } else {
        resultsCountEl.classList.add('d-md-block');
        if (filteredList.length > 0) {
            const pluralisedResultLabel = filteredList.length === 1 ? 'result' : 'results';
            resultsCountEl.innerHTML = `${filteredList.length} ${pluralisedResultLabel}`;
        } else {
            resultsCountEl.innerHTML = 'No results';
        }
    }
}