const yargs = require('yargs');

const {formattedResponse} = require('./utilities/helpers');

const argv = yargs
	.options({
		a: {
			demand: true,
			alias: 'address',
			describe: 'the address you are interested in generating weather data for',
			string: true
		}
	})
	.help()
	.alias('help', 'h')
	.argv;

const encodedAddress = encodeURIComponent(argv.address);

formattedResponse(encodedAddress).then(function(data) {
	const now = data.now;
	const thisHour = data.thisHour;
	const thisDay = data.thisDay;
	const thisWeek = data.thisWeek;
	
}).catch(function(error) {
	console.log(error);
});
