const $ = require('./../lib/jquery.js');
const Bus = require('./neutrona.bus.js');

const run = (callback) => (x) => {
	const result = callback();

	return Promise.resolve(result || x);
	// return Promise.resolve(x);
};

const trigger = (message, args) => (x) => {
	let promise = Promise.resolve(x);
	const thenable = {
		then: (y) => {
			promise = promise.then(y);
			return thenable;
		},
	};
	const allArgs = (args || []).concat([thenable]);

	Bus.trigger(message, allArgs);

	return promise;
};

const click = () => (elQ) => {
	let promise = Promise.resolve(elQ);

	elQ.mousedown();
	elQ.click();
	elQ.mouseup();

	promise = promise.then(trigger('click'));

	return promise;
};

const move = () => (elQ) => {
	let result = Promise.resolve(elQ);

	$('#ghostbuster-cursor')
		.toggleClass('animated', Actions.move.animated)
		.css(getClickPosition(elQ))
	;

	if(Actions.move.animated) {	
		console.log("delaying...");
		// This delay matches css styling of the cursor's transition
		result = result.then(pause(1));
	}

	return result;
};

const type = (text) => (elQ) => {
	const typeAsynchronously = (onDone) => {
		const keyDelay = 0;//3236 / ((text || "").length || 1); // Caveat refactor!
		var type = function(text2) {

			elQ.val(text2).change();

			if(text2 !== text) {
				window.setTimeout(() => type(text.slice(0, text2.length+1)), keyDelay);
			} else {
				onDone();
			}
		};

		type(text.slice(0,1));
	};

	return new Promise(typeAsynchronously);
};

const say = (text) => (elQ) => {
	const sayAsynchronously = (onDone, onError) => {
		// responsiveVoice.speak(text, "UK English Female", {onend: onDone, onerror: onError});
		console.log("responsiveVoice is disabled for now, so not saying:", text);
		// @TODO remove onDone when re-enabling responsiveVoice.speak again:
		onDone();
	};

	return new Promise(sayAsynchronously);
}

const pause = (sec) => (elQ) => {
	console.log("pausing!", sec);
	const pauseAsynchronously = (onDone) => {
		window.setTimeout(() => onDone(elQ), sec * 1000);
	};

	return new Promise(pauseAsynchronously);
};

// Note: this is not an action
const moveThen = (x) => (...args) => (elQ) => {
	return Promise.resolve(elQ)
		.then(move())
		.then(x(...args))
	;
};

// Note: this is not an action
const getClickPosition = (elQ) => {
	let clickPosition = {top: 100, left: 100};

	if(elQ.any()) {
		const clientRect = elQ[0].getBoundingClientRect();
		clickPosition = {top: clientRect.top + clientRect.height - 8, left: clientRect.left + clientRect.width / 2};
	}

	return clickPosition;
};

const Actions = {
	say,
	run,
	trigger,
	move,
	click: moveThen(click),
	type: moveThen(type),
	pause,
};

// Defaults:

// Setting the key delay to 0 will speed up running the scenarios considerably.
Actions.type.keyDelay = 0;
// Disabling the move will speed up running the scenarios considerably.
Actions.move.animated = false;

module.exports = Actions;
