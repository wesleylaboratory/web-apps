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

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#converting_a_digest_to_a_hex_string
 * @param {string} val
 * @returns {Promise<string>}
 */
export async function hashString(val) {
    const msgUint8 = new TextEncoder().encode(val); // encode as (utf-8) Uint8Array
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8); // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
    const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, '0'))
        .join(''); // convert bytes to hex string
    return hashHex;
}