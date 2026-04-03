/**
 * @param {number} year
 * @returns {Date | null}
 */
export function easterByYear(year) {
    /** @type {Record<number, Date>} */
    const easterDict = {
        2026: new Date(`April 5, ${year}`),
        2027: new Date(`March 28, ${year}`),
        2028: new Date(`April 16, ${year}`),
        2029: new Date(`April 1, ${year}`),
        2030: new Date(`April 21, ${year}`),
        2031: new Date(`April 13, ${year}`),
        2032: new Date(`March 28, ${year}`),
        2033: new Date(`April 17, ${year}`),
        2034: new Date(`April 9, ${year}`),
        2035: new Date(`March 25, ${year}`),
        2036: new Date(`April 13, ${year}`),
        2037: new Date(`April 5, ${year}`),
        2038: new Date(`April 25, ${year}`),
        2039: new Date(`April 10, ${year}`),
        2040: new Date(`April 1, ${year}`),
        2041: new Date(`April 21, ${year}`),
        2042: new Date(`April 6, ${year}`),
        2043: new Date(`March 29, ${year}`),
        2044: new Date(`April 17, ${year}`),
        2045: new Date(`April 9, ${year}`)
    };

    return easterDict[year] || null;
};