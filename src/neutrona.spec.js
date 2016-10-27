const $ = require('./../lib/jquery.js');
const runner = require('./neutrona.runner.js');
const genUUID = require('node-uuid').v4;

class Step {
	constructor(description, action) {
		this.id = genUUID();
		this.description = description;
		this.action = action;
	}
}

class Scenario {
	constructor(description, options) {
		this.id = genUUID();
		this.description = description;
		this.options = options || {};
		this.steps = [];
	}
}

const scenarios = [];
let currentScenario;

const Spec = {
	scenario(description, options, callback) {
		if($.isFunction(options)) {
			callback = options;
			options = undefined;
		}

		const scenario = currentScenario = new Scenario(description, options);
		scenarios.push(currentScenario);
		callback();
		currentScenario = undefined;

		runner.setScenarios(scenarios);

		return scenario;
	},
	step(description, action) {
		if(currentScenario) {
			currentScenario.steps.push(new Step(description, action));
		} else {
			console.warn("A 'step' outside a 'scenario' was detected! Discarding: ", description);
		}
	},
};

module.exports = Spec;
