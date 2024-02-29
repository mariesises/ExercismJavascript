// @ts-check

/**
 * Calculates the sum of the two input arrays.
 *
 * @param {number[]} array1
 * @param {number[]} array2
 * @returns {number} sum of the two arrays
 */
export function twoSum(array1, array2) {
    let sumTotal = Number(array1.join('')) + Number(array2.join(''))
    return sumTotal;
}

/**
 * Checks whether a number is a palindrome.
 *
 * @param {number} value
 * @returns {boolean} whether the number is a palindrome or not
 */
export function luckyNumber(value) {
    const numStr = String(value);
    const character = numStr.split('');

    const numInverted = character.reverse().join('');
    return numStr === numInverted;
}

/**
 * Determines the error message that should be shown to the user
 * for the given input value.
 *
 * @param {string|null|undefined} input
 * @returns {string} error message
 */
export function errorMessage(input) {
    if (!input) {
        return 'Required field';
    } else {
        return Number(input) ? '' : 'Must be a number besides 0';
    }
}