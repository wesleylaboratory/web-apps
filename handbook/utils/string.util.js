/**
 * Html encodes string values to be safe for DOM rendering.
 * @param {string} val
 * @returns {string}
 */
export function encodeHtmlString(val) {
    const div = document.createElement('div');
    const text = document.createTextNode(val);
    div.appendChild(text);
    return div.innerHTML ?? '';
}

/**
 * Adds highlights to matching characters based on passed value.
 * @param {string | null | undefined} val 
 * @param {string} sourceString 
 * @returns {string}
 */
export function highlightMatchingText(val, sourceString) {
    if (!val) return sourceString;

    const trimmedText = sourceString.trim();
    if (val.length === 1 && trimmedText.toLowerCase().charAt(0) === val.toLowerCase()) {
        return `<mark>${trimmedText.charAt(0)}</mark>${trimmedText.slice(1)}`;
    }

    const safeTerm = val.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return sourceString.replace(new RegExp(safeTerm, 'gi'), match => `<mark>${match}</mark>`);
}