const request = require('request');

let weatherForecast = (latitude, longitude, callback) => {
	
	request({
		url: `https://api.darksky.net/forecast/2c7bdd0cf569787aac3afa6a26f54e44/${latitude},${longitude}`,
		json: true
	}, (error, response, body) => {
		if (!error && response.statusCode === 200) {
			callback(undefined, {
				temperature: body.currently.temperature,
				apparentTemperature: body.currently.apparentTemperature,
				highTemperature: body.daily.data[0].temperatureHigh,
				lowTemperature: body.daily.data[0].temperatureLow,
				currentCondition: body.minutely.summary,
				futureCondition: body.hourly.summary
			});
		} else {
			callback('Unable to fetch weather');
		}
	});
};


module.exports.weatherForecast = weatherForecast;