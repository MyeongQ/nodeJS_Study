setImmediate(() => {
    console.log("immediate");
})  // 3번

process.nextTick(() => {
    console.log("next tick");
})  // 1번

Promise.resolve().then(() => console.log('promise'));
// 2번

