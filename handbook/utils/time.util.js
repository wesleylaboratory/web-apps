import { isNullOrEmpty, hashString } from "./string.util";

/**
 *
 * @param {Function} callback
 * @param {number} delay
 * @param {string} [id]
 */
export function debounce(callback, delay, id) {
    const identifier = isNullOrEmpty(id) ? id : hashString(JSON.stringify(callback));
    window.clearTimeout(window[`debounce${identifier}`]);

    window[`debounce${identifier}`] = window.setTimeout(callback, delay);
}