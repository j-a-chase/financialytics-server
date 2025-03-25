/**
 * toTitleCase.js
 * James Chase
 * 240325
 * Capitalize the first letter of each word in a string
*/

const toTitleCase = str => {
    return str.toLowerCase()
        .split(' ')
        .map(s => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ');
};

module.exports = { toTitleCase: toTitleCase };
