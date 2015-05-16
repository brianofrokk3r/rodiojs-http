'use strict'

var handler = require('./lib/handler');
var program = require('commander');
var config = require('./package.json')

/** capture argv **/
program
  .version(config.version)
  .usage('[options]')
  .option('-t, --time <n>', 'Total time to elapse (seconds)')
  .option('-c, --concurrency <n>', 'Number of concurrent requests (requests/second)')
  .option('-x, --post <s>', 'Post parameters in quoted querystring form ( e.g. "foo=1&baz=2" )')
  .option('-h, --host <s>', 'HTTP host to request in quotes')
  .parse(process.argv);

/** Execute if args exist **/
var args = process.argv;
if (!args.length) {
	console.error('Missing arguments -t, -c, -x, and/or -h.');
  process.exit(1);
} else {
	handler
		.totalTime(program.time)
		.concurrency(program.concurrency)
		.restMethod(program.post)
		.hostUrl(program.host).exec();
}

/** Exit if user hates self **/
process.on('SIGINT', function () {
  console.log('Ctrl-C...');
  handler.checkTimer(true);
  process.exit(2);
});