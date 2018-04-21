let asyncAdd = (a, b) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (typeof a === 'number' && typeof b === 'number') {
				resolve(a + b);
			} else {
				reject('Invalid input');
			}
		}, 1500)
	});
};

asyncAdd(1, 3).then((result) => {
	console.log("Result", result);
}, (errorMessage) => {
	console.log(errorMessage);
});

// let somePromise = new Promise((resolve, reject) => {
// 	setTimeout(() => {
// 			reject("Unable to fulfil promise");
// 			resolve("Hey, it worked.");
// 	}, 2500)
//
//
// });
//
// somePromise.then((message) => {
// 	console.log('Success!', message);
// }, (errorMessage) => {
// 	console.log("Error:", errorMessage);
// });

