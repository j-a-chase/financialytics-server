/**
 * getStringMonth.js
 * James Chase
 * 240325
 * Returns the current month given the month number (0-11)
*/

const getStringMonth = monthNum => {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return monthNames[monthNum];
};

module.exports = {getStringMonth: getStringMonth};
