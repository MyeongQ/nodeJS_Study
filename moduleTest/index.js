// moduleTest/index.js
const checkNumber = require( './func');
//import checkNumber from "./func"
const { odd, even } = require('./var');


const checkStringOddOrEven = (str) => {
    if (str.length%2) {
        return odd;
    }
    return even;
};

console.log(checkNumber(10));
console.log(checkStringOddOrEven("Hello World"));

