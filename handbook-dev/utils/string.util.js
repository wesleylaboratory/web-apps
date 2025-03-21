/**
 * @param {string|null|undefined} val
 * @returns {boolean}
 */
export function isNullOrEmpty(val) {
    return typeof val === 'undefined' || val == null || val === '';
}