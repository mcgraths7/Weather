const request = require('request');

const formattedResponse = function(encodedAddress) {
	
	const getGeocodeCoordinates = function () {
		return new Promise(function (resolve, reject) {
			request({
				url: `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=AIzaSyC-4GBNQbBd2V6K76Us2OmUQhDVO3iS3MU`,
				json: true
			}, function (error, response, body) {
				if (error) {
					reject('Unable to connect to Google server');
				} else if (body.status === 'ZERO_RESULTS') {
					reject('No location data for that address');
				} else if (body.status === 'OK') {
					resolve({
						latitude: body.results[0].geometry.location.lat,
						longitude: body.results[0].geometry.location.lng
					})
				}
			})
		})
	};
	
	const getWeatherForecast = function (latitude, longitude) {
		return new Promise(function (resolve, reject) {
			request({
				url: `https://api.darksky.net/forecast/2c7bdd0cf569787aac3afa6a26f54e44/${latitude},${longitude}`,
				json: true
			}, function (error, response, body) {
				if (!error && response.statusCode === 200) {
					resolve({
						rightNow: body.currently,
						thisHour: body.minutely,
						thisDay: body.hourly,
						thisWeek: body.daily
					});
				} else {
					reject('Unable to fetch weather');
				}
			})
		})
	};
	const formattedData = function() {
		return getGeocodeCoordinates().then(function (coordinates) {
			return getWeatherForecast(coordinates.latitude, coordinates.longitude).then(function (weatherResponse) {
				const rightNow = weatherResponse.rightNow;
				const thisHour = weatherResponse.thisHour;
				const thisDay = weatherResponse.thisDay;
				const thisWeek = weatherResponse.thisWeek;
				const now = {
					summary: rightNow.summary,
					currentTemperature: rightNow.temperature,
					apparentTemperature: rightNow.apparentTemperature,
					humidity: rightNow.humidity * 100,
					windSpeed: rightNow.windSpeed,
					windGust: rightNow.windGust,
					nearestStormDistance: rightNow.nearestStormDistance
				};
				const forTheNextHour = {
					summary: thisHour.summary,
					precipitation: thisHour.data.map((minute) => {
						return {
							time: minute.time,
							intensity: minute.precipIntensity,
							probability: minute.precipProbability
						};
					})
				};
				const forTheDay = {
					today: thisDay.data.map((thisDay) =>{
						return {
							summary: thisDay.summary,
							currentTemperature: thisDay.temperature,
							apparentTemperature: thisDay.apparentTemperature,
							humidity: thisDay.humidity * 100,
							precipIntensity: thisDay.precipIntensity,
							precipProbability: thisDay.precipProbability,
							windSpeed: thisDay.windSpeed,
							windGust: thisDay.windGust
						}
					})
				};
				const forTheWeek = {
					thisWeek: thisWeek.data.map((day) => {
						return {
							summary: day.summary,
							sunriseTime: day.sunriseTime,
							sunsetTime: day.sunsetTime,
							temperatureHigh: day.temperatureHigh,
							temperatureHighTime: day.temperatureHighTime,
							temperatureLow: day.temperatureLow,
							temperatureLowTime: day.temperatureLowTime,
							apparentTemperatureHigh: day.apparentTemperatureHigh,
							apparentTemperatureHighTime: day.apparentTemperatureHighTime,
							apparentTemperatureLow: day.apparentTemperatureLow,
							apparentTemperatureLowTime: day.apparentTemperatureLowTime,
							humidity: day.humidity * 100,
							windSpeed: day.windSpeed,
							windGust: day.windGust,
							windGustTime: day.windGustTime
						}
					})
				};
				
				return new Promise(function(resolve) {
					resolve({
						now: now,
						forTheNextHour: forTheNextHour,
						forTheDay: forTheDay,
						forTheWeek: forTheWeek
					})
				})
			})
		}).catch(function (error) {
			console.log(error);
		});
	};
	return formattedData();
};

module.exports = {formattedResponse};