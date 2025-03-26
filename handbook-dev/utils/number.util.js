/**
 *
 * @param {number} val
 * @param {number} maxPlaces
 * @returns {number}
 */
export function formatMaxDecimalPlaces(val, maxPlaces) {
    if (Number.isInteger(val)) {
        return val;
    } else {
        return parseFloat(val.toFixed(maxPlaces));
    }
}