const { URL } = require('url');

const myURL = new URL('http://gilbut.co.kr/?artist=aespa&artistId=11003&collectionName=savage&collectionName=savegeED&collectionid=1188887');
console.log('searchParams: ', myURL.searchParams);
console.log('searchParams.getAll(): ', myURL.searchParams.getAll('collectionName'));
console.log('searchParams.get(): ', myURL.searchParams.get('artist'));
console.log('searchParams.has(): ', myURL.searchParams.has('artistId'));
console.log('searchParams.keys(): ', myURL.searchParams.keys());
console.log('searchParams.values(): ', myURL.searchParams.values());

myURL.searchParams.append('artist', 'Winter');
myURL.searchParams.append('artist', 'Karina');
console.log(myURL.searchParams.getAll('artist'));
myURL.searchParams.set('artist', 'Zizel');
console.log(myURL.searchParams.getAll('artist'));
myURL.searchParams.delete('artist', 'Zizel');
console.log(myURL.searchParams.getAll('artist'));

console.log('searchParams.toString(): ', myURL.searchParams.toString());
myURL.search = myURL.searchParams.toString();

