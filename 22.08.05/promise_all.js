const list = ['a', 'b', 'c', 'd', 'e'];

const justPrinting = async (str, time) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(str + ', ' + time + 'sec' + Date.now());
    }, 1000 * time);
    resolve();
  });
};

const main = async () => {
  let i = 1;
  const result = await Promise.all(
    list.map(async (item) => {  // 동기 실행으로 바꾸려면? -> async-await을 지움
      await justPrinting(item, i); 
      i++;
    })
  );
  console.log(i + ', finished!');
};

main();

module.exports = main;
