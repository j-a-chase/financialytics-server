/**
 * Get the current month
*/

const getStringMonth = monthNum => {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return monthNames[monthNum];
};

module.exports = {getStringMonth: getStringMonth};
