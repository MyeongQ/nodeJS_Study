// globalB.js

const A = require('./globalA');

global.message = "Hello World";

console.log(A());

