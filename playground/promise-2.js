const request = require('request');
const address = require('../address.json');

let geocodeAddress = (decodedAddress) => {
	let encodedAddress = encodeURIComponent(decodedAddress);
	return new Promise((resolve, reject) => {
		request({
			url: `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=AIzaSyC-4GBNQbBd2V6K76Us2OmUQhDVO3iS3MU`,
			json: true
		}, (error, response, body) => {
			if (error) {
				reject('Unable to connect to Google server');
			} else if(body.status === 'ZERO_RESULTS') {
				reject('No location data for that address');
			} else if (body.status === 'OK') {
				resolve({
					city: body.results[0].address_components[2].long_name,
					latitude: body.results[0].geometry.location.lat,
					longitude: body.results[0].geometry.location.lng
				})
			}
		});
	});
};

let weatherForecast = (latitude, longitude) => {
	return new Promise((resolve, reject) => {
		request({
			url: `https://api.darksky.net/forecast/2c7bdd0cf569787aac3afa6a26f54e44/${latitude},${longitude}`,
			json: true
		}, (error, response, body) => {
			if (!error && response.statusCode === 200) {
				resolve(undefined, {
					temperature: body.currently.temperature,
					apparentTemperature: body.currently.apparentTemperature,
					currentCondition: body.minutely.summary,
					futureCondition: body.hourly.summary
				});
			} else {
				reject('Unable to fetch weather');
			}
		});
	});
};


geocodeAddress("3 west end ave madison nj").then((result) => {
	console.log(JSON.stringify(result, undefined, 2));
}).catch((errorMessage) => {
	console.log(errorMessage);
});