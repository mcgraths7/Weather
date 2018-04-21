const request = require('request');

let geocodeAddress = (decodedURL, callback) => {
	let encodedURL = encodeURIComponent(decodedURL);
	request({
		url: `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedURL}&key=AIzaSyC-4GBNQbBd2V6K76Us2OmUQhDVO3iS3MU`,
		json: true
	}, (error, response, body) => {
		if (error) {
			callback('Unable to connect to server');
		} else if (body.status === 'ZERO_RESULTS') {
			callback('Zero Results');
		} else if (body.status === 'OK') {
			callback(undefined, {
				city: body.results[0].address_components[2].long_name,
				latitude: body.results[0].geometry.location.lat,
				longitude: body.results[0].geometry.location.lng
			});
		}
	});
};

module.exports.geocodeAddress = geocodeAddress;