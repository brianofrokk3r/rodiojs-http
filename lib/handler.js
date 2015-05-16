var request = require('../node_modules/request');
var querystring = require('querystring');

handler = {
	elapsedTime: 0,
	finalConcurrency: 0,
	concurrencyCounter: 0,
	finalTime: 0,
	restMethod: restMethod,
	checkTimer: checkTimer, 
	totalTime: totalTime,
	concurrency: concurrency,
	hostUrl: hostUrl,
	exec: exec,
	makeRequest: makeRequest,
	makeGet: makeGet,
	makePost: makePost
}

function totalTime(val) {
	this.timeInterval = parseInt(val);
	return this;
}

function concurrency(val) {
	this.requestConcurrency = parseInt(val);
	return this;
}

function restMethod(val) {
	if(val) {
		this.postOptions 	= val;
		this.restType = 'post';
	} else {
		this.restType = 'get';
	}
	return this;
}

function hostUrl(val) {
	this.url = val;
	return this;
}

function init() {
	this.elapsedTime = 0;
	return this;
}

function exec() {
	handler.makeRequest();
	setInterval(function(){
		handler.makeRequest();
		checkTimer();
	},1000);
}

/** Calculate Concurrecny **/
function checkTimer(updateUser) {
	handler.elapsedTime++;
	if(handler.elapsedTime == handler.timeInterval || updateUser === true) {
		handler.finalTime = handler.elapsedTime;
		handler.finalConcurrency = handler.concurrencyCounter/handler.elapsedTime;
		console.log('Total Time:', handler.elapsedTime);
		console.log('Final concurrency:',handler.finalConcurrency,'req/sec');
		process.exit(0);
	}
}

function makeRequest() {
	for( var i = 0; i < handler.requestConcurrency; i++ ) {
		if(handler.restType === 'post') {
			handler.makePost();
		} else {
			handler.makeGet();
		}
		
	}
}

function makePost() {
	request
	  .post(handler.url, querystring.parse(handler.postOptions))
	  .on('response', function(response) {
	  	console.log(response.statusCode + ' - ' + handler.url + ', ' + handler.postOptions);
	  	handler.concurrencyCounter++;
	  })
	  .on('error', function(err) {
	  	console.log(response.statusCode + ' - ' + handler.url);
	  	handler.concurrencyCounter++;
	  });
}

function makeGet() {
	request
	  .get(handler.url)
	  .on('response', function(response) {
	  	console.log(response.statusCode + ' - ' + handler.url);
	  	handler.concurrencyCounter++;
	  })
	  .on('error', function(err) {
	  	console.log(response.statusCode + ' - ' + handler.url);
	  	handler.concurrencyCounter++;
	  });
}

module.exports = handler;