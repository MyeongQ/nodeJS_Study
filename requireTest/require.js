function whatIsThis() {
    console.log(this === exports, this===global);
    whatIsThis2();
}

function whatIsThis2() {
    console.log(this === global);
}
whatIsThis();