// moduleTest/func.js
const { odd, even } = require('./var');

function checkOddOrEven(num) {
    if (num %2) {
        return odd;
    }
    return even;
}

//module.exports = checkOddOrEven;
export default checkOddOrEven;

