import dayjs from './libs/dayjs/1.11.13/dayjs.min.js';
import { useHandbookApi } from './apis/handbook.api.js';
import { encodeHtmlString } from './utils/string.util.js';

(async () => {
    const tbodyEl = document.querySelector('#handbook-files tbody');
    const loadingStr = `
        <tr><td colspan="2" class="text-center">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </td></tr>
    `;

    const { getHandbookFiles } = useHandbookApi();
    tbodyEl.innerHTML = loadingStr;
    const handbookFilesResponse = await getHandbookFiles('', { limit: 5 });
    tbodyEl.innerHTML = '';

    if (tbodyEl != null && Array.isArray(handbookFilesResponse.files)) {
        const dateFormat = 'MMM D, YYYY, h:mm A';

        for (const file of handbookFilesResponse.files) {
            const tr = document.createElement('tr');
            const encodedStr = `
                <td><a href="${file.url}">${encodeHtmlString(file.name)}</a></td>
                <td>${dayjs(file.lastUpdated).format(dateFormat)}</td>
            `;

            tr.innerHTML = encodedStr;
            tbodyEl.appendChild(tr);
        }
    }
})();