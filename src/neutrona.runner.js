
const {pause, trigger, run} = require('./neutrona.actions.js');

const Runner = {
	scenarios: [],
	setScenarios(scenarios) {
		this.scenarios = scenarios;

		return Promise.resolve()
			.then(trigger('scenariosChanged', [scenarios]))
		;
	},
	runScenario(scenario, stepDelay) {
		console.error("Death to all ghosts!");

		if(typeof scenario === "string") {
			const scenarioDescription = scenario;
			scenario = this.scenarios.find((s) => s.description === scenario);

			if(!scenario) {
				throw Exception("No such scenario: " + scenarioDescription);
			}
		}

		// This needs to go to a logging component inside a then:
		console.log("Running scenario:", scenario.description);

		const promise = Promise.resolve()
			.then(trigger('executingScenario', [scenario]))
			.then(() => scenario.steps.reduce(
				(promisedActions, nextStep) => {
					return promisedActions
						.then(() => Promise.resolve()
							.then(trigger('executingStep', [nextStep]))
							// This needs to go to a logging component inside a then:
							.then(run(() => console.log("Running step", nextStep.description)))
							.then(nextStep.action)
							// This could go to a separate component that just delays the bus message:
							.then(pause(stepDelay || 0))
							.then(trigger('stepExecuted', [nextStep]))
							.catch((reason) => {
								Promise.resolve().then(trigger('stepFailed', [nextStep, reason]));
								return Promise.reject(reason);
							})
						)
					;
				},
				Promise.resolve()
			))
			.then(trigger('scenarioExecuted', [scenario]))
			.then(run(() => {console.log("Scenario completed successfully:", scenario.description);}))
			.catch((reason) => {
				console.log("Scenario failed:", scenario.description);
				Promise.resolve().then(trigger('scenarioFailed', [scenario, reason]));
			})
		;

		return promise;
	},
};

module.exports = Runner;
