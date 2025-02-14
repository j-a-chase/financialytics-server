/**
 * Get the current month
*/

const getCurrentMonth = () => {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return monthNames[new Date().getMonth()];
};

module.exports = {getCurrentMonth: getCurrentMonth};
