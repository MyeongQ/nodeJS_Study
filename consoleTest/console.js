console.time('시작 시간');
console.error('에러 발생');

console.table([
    { name: '제로', birth: 1994},
    { name: '명규', birth: 1998},
    { name: '동균', birth: 1996}, 
])

const obj = {
    outside : {
        inside : {
            key: 'value',
            value: 8765,
        }
    }
}

console.dir(obj, {colors: true, depth: 3});
console.timeEnd('시작 시간');

function b () {
    console.trace('위치 추적');
}
function a () {
    b();
}
a();