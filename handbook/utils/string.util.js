/**
 * @param {string|null|undefined} val
 * @returns {boolean}
 */
export function isNullOrEmpty(val) {
    return typeof val === 'undefined' || val == null || val === '';
}

/**
 * @param {string} val
 * @returns {string}
 */
export function encodeHtmlString(val) {
    const div = document.createElement('div');
    const text = document.createTextNode(val);
    div.appendChild(text);
    return div.innerHTML ?? '';
  }