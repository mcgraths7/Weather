const axios = require('axios');
const request = require('request');
//
// const geoURL = function(encodedAddress) {
// 	return `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=AIzaSyC-4GBNQbBd2V6K76Us2OmUQhDVO3iS3MU`;
// };
//
// const weatherURL = async function(geocodeURL) {
// 	axios.get(geocodeURL).then(response => {
// 		const latitude = response.data.results[0].geometry.location.lat;
// 		const longitude = response.data.results[0].geometry.location.lng;
// 		return `https://api.darksky.net/forecast/2c7bdd0cf569787aac3afa6a26f54e44/${latitude},${longitude}`;
// 	}).catch(err => {
// 		console.log(err);
// 	})
// };
//
// const getWeatherResponse = async function(encodedAddress) {
// 	try {
// 		const geocodeURL = geoURL(encodedAddress);
// 		const weatherDataURL = await weatherURL(geocodeURL);
// 		const weatherData = await getWeatherData(weatherDataURL);
// 		return {
// 			weatherRightNow: weatherData.currently,
// 			weatherThisHour: weatherData.minutely,
// 			weatherThisDay: weatherData.hourly,
// 			weatherThisWeek: weatherData.daily
// 		};
// 	} catch (e) {
// 		console.log(e);
// 	}
// };
const newData = function(encodedAddress) {
	
	
	const getGeocodeCoordinates = function() {
		return new Promise(function(resolve, reject) {
			request({
				url: `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=AIzaSyC-4GBNQbBd2V6K76Us2OmUQhDVO3iS3MU`,
				json: true
			}, function(error, response, body) {
				if (error) {
					reject('Unable to connect to Google server');
				} else if(body.status === 'ZERO_RESULTS') {
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
	
	const getWeatherForecast = function(latitude, longitude) {
		return new Promise(function(resolve, reject) {
			request({
				url: `https://api.darksky.net/forecast/2c7bdd0cf569787aac3afa6a26f54e44/${latitude},${longitude}`,
				json: true
			}, function(error, response, body) {
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
	
	return getGeocodeCoordinates().then(function(coordinates) {
		return getWeatherForecast(coordinates.latitude, coordinates.longitude).then(function(weatherResponse) {
			console.log(JSON.stringify(weatherResponse, undefined, 2));
		}).catch(function(err) {
			console.log(err);
		})
	}).catch(function(err) {
		console.log(err);
	})
	
};


const data = async function(encodedAddress) {
	const geoURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=AIzaSyC-4GBNQbBd2V6K76Us2OmUQhDVO3iS3MU`;
	const getGeocodeResponse = async function() {
		
		const createCoordinates = function(response) {
			const latitude = response.data.results[0].geometry.location.lat;
			const longitude = response.data.results[0].geometry.location.lng;
			return `https://api.darksky.net/forecast/2c7bdd0cf569787aac3afa6a26f54e44/${latitude},${longitude}`;
		};
		
		try {
			const request = await axios.get(geoURL);
			return createCoordinates(request);
		} catch (e) {
			console.log(e);
			throw e;
		}
	};
	
	const getWeatherURL = async function() {
		try {
			return await getGeocodeResponse()
		} catch (e) {
			console.log(e);
		}
	};
	
	const getWeatherData = async function() {
		try {
			const weatherURL = await getWeatherURL();
			const weatherData = await axios.get(weatherURL);
			return formatResults(weatherData);
		} catch (e) {
			console.log(e);
		}
	};
	
	const formatResults = function(weatherData) {
		return {
			weatherRightNow: weatherData.data.currently,
			weatherThisHour: weatherData.data.minutely,
			weatherThisDay: weatherData.data.hourly,
			weatherThisWeek: weatherData.data.daily
		}
	};
	
	return {
		rightNow: {
			summary: getWeatherData().then(now => {
				return now.weatherRightNow.summary;
			}).catch(err => {
				console.log(err);
			})
		},
		forTheHour: {
			summary: getWeatherData().then(hour => {
				return hour.weatherThisHour.summary;
			}).catch(err => {
				console.log(err);
			})
		}
	};
	
	// rightNow: function(encodedAddress) {
	// 	try {
	// 		const response = getWeatherResponse(encodedAddress);
	// 		return {
	// 			summary: response.weatherRightNow.summary,
	// 			currentTemperature: response.weatherRightNow.temperature,
	// 			apparentTemperature: response.weatherRightNow.apparentTemperature,
	// 			humidity: response.weatherRightNow.humidity * 100,
	// 			windSpeed: response.weatherRightNow.windSpeed,
	// 			windGust: response.weatherRightNow.windGust,
	// 			nearestStormDistance: response.weatherRightNow.nearestStormDistance
	// 		}
	// 	} catch (e) {
	// 		console.log(e);
	// 	}
	// }
	// forTheNextHour: function() {
	// 	return {
	// 		summary: weatherThisHour.summary,
	// 		precipitation: weatherThisHour.data.map((minute) => {
	// 			return {
	// 				time: minute.time,
	// 				intensity: minute.precipIntensity,
	// 				probability: minute.precipProbability
	// 			};
	// 		})
	// 	}
	// },
	// forTheRestOfTheDay: function() {
	// 	return weatherThisDay.data.map((hour) =>{
	// 		return {
	// 			summary: hour.summary,
	// 			currentTemperature: hour.temperature,
	// 			apparentTemperature: hour.apparentTemperature,
	// 			humidity: hour.humidity * 100,
	// 			precipIntensity: hour.precipIntensity,
	// 			precipProbability: hour.precipProbability,
	// 			windSpeed: hour.windSpeed,
	// 			windGust: hour.windGust
	// 		}
	// 	});
	// },
	// forTheRestOfTheWeek: function() {
	// 	return weatherThisWeek.data.map((day) => {
	// 		return {
	// 			summary: day.summary,
	// 			sunriseTime: day.sunriseTime,
	// 			sunsetTime: day.sunsetTime,
	// 			temperatureHigh: day.temperatureHigh,
	// 			temperatureHighTime: day.temperatureHighTime,
	// 			temperatureLow: day.temperatureLow,
	// 			temperatureLowTime: day.temperatureLowTime,
	// 			apparentTemperatureHigh: day.apparentTemperatureHigh,
	// 			apparentTemperatureHighTime: day.apparentTemperatureHighTime,
	// 			apparentTemperatureLow: day.apparentTemperatureLow,
	// 			apparentTemperatureLowTime: day.apparentTemperatureLowTime,
	// 			humidity: day.humidity * 100,
	// 			windSpeed: day.windSpeed,
	// 			windGust: day.windGust,
	// 			windGustTime: day.windGustTime
	// 		}
	// 	});
	// }
};

module.exports = {newData};