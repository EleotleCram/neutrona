const $ = require('./../lib/jquery.js');

const MAX_TIMEOUT = 5 * 1000; // 5 sec.
const awaitCondition = (description, checkCondition, selector) => {
	const promiseFunction = () => {
		const asyncAwait = (resolve, reject) => {
			const t0 = Date.now();

			const tryToResolve = () => {
				const result = $(selector);

				if(checkCondition(result)) {
					console.log("resolving to", result);
					resolve(result);
				} else if((Date.now() - t0) < MAX_TIMEOUT) {
					window.setTimeout(tryToResolve, 200);
				} else {
					const errorMessage = `The selector '${selector}' was not ${description} in time.`;
					console.warn(errorMessage);
					reject(Error(errorMessage));
				}
			};

			tryToResolve();
		};

		return new Promise(asyncAwait);
	};

	// This makes an awaitCondition spec also work as the entry point of a promise chain:
	promiseFunction.then = (x) => promiseFunction().then(x);

	return promiseFunction;
};

const waitFor = awaitCondition.curry('found', (elQ) => elQ.any());
const waitForAny = waitFor; // for symmetrical reasons
const waitForNone = awaitCondition.curry('removed', (elQ) => !elQ.any());

const Conditions = {
	waitFor,
	waitForAny,
	waitForNone,
};

module.exports = Conditions;
