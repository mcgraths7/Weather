const yargs = require('yargs');

const {newData} = require('./utilities/helpers');

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


newData(encodedAddress);
