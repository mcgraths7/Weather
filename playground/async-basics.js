console.log('starting app');

setTimeout(() => console.log('timeout'), 1000);
setTimeout(() => console.log('timeout 2'), 0);

console.log('finished');