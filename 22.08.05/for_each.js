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
  list.forEach(async (item) => {
    await justPrinting(item, i);
    i++;
  });
  console.log(i + ', finished!');
};

module.exports = main;

main();
