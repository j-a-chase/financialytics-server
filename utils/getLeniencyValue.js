/*
    Calculates the leniency percentage given the selection
*/

const leniencyLevels = ['STRICT', 'NORMAL', 'LENIENT'];

const getLeniencyValue = leniency => {
    switch (leniency) {
        case 'strict':
            return 1;
        case 'normal':
            return 1.1;
        case 'lenient':
            return 1.25;
        default:
            return 1;
    }
}

module.exports = {getLeniencyValue: getLeniencyValue, leniencyLevels: leniencyLevels};
