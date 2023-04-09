const list = { a: 'a', b: 'b', c: 'c', d: 'd', e: 'e' };

const justPrinting = async (str, time) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(str + ', ' + time + 'sec');
    }, 1000 * time);
    resolve();
  });
};

const main = async () => {
  let i = 1;
  for (const item in list) {
    await justPrinting(item, i);
    i++;
  }
  console.log(i + ', finished!');
};

main();

module.exports = main;
