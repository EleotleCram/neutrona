const $ = require('./../lib/jquery.js');
const Bus = require('./neutrona.bus.js');
const Runner = require('./neutrona.runner.js');

const initializeGhostBusterPanel = function() {
	$('body').append(`
		<div id="ghostbuster-main">
			<svg id="ghostbuster-tab" width="20px" height="100px" viewBox="-1 0 6 25">
				<defs id="defs4">
				   <filter
					   style="color-interpolation-filters:sRGB"
					   id="filter4171"
					   x="-0.10787508"
					   y="-0.021605004"
					   width="1.2157502"
					   height="1.04321" >
					   <feGaussianBlur
						   stdDeviation="0.22473975"
						   id="feGaussianBlur4173" />
				   </filter>
			   </defs>

			   <path
				   style="fill:none;fill-opacity:0.75;fill-rule:evenodd;stroke:#000000;stroke-width:0.1;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;filter:url(#filter4171)"
				   d="m 4.9999999,0 c -1,1 -3,2 -3.9999999,3 C 0,4 0,5 0,5 l 0,15.0598 c 0,0 0,0.9402 0.981235,1.9538 0.861422,0.8898 3.0187649,1.9864 3.9742589,2.9517"
			   />

				<path
					style="fill:#ffffff;fill-rule:evenodd;stroke:none;stroke-width:0.1;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;fill-opacity:0.85;"
					d="m 4.9999999,0 c -1,1 -3,2 -3.9999999,3 C 0,4 0,5 0,5 l 0,15.0598 c 0,0 0,0.9402 0.981235,1.9538 0.861422,0.8898 3.0187649,1.9864 3.9742589,2.9517 z"
				/>
			</svg>
			<div class="ghostbuster-wrap">
				<div class="ghostbuster-contents">
					<h1 class="scenario"></h1>
					<ol class="steps"></ol>
				</div>
			</div>
		</div>
	`);

	$('body').append(`
		<div id="ghostbuster-cursor">
			<div class="click-indicator"></div>
			<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" class="dropshadow">
				<path
					style="fill:#000000;stroke:none;stroke-opacity:1;fill-opacity:1"
					d="M 7,0.014 C 6.73,0.014 6.46,0.068 6.203,0.18 5.472,0.497 4.999,1.219 5,2.017 l 0.026,18.127 c 0.001,0.797 0.476,1.518 1.206,1.834 0.256,0.109 0.525,0.164 0.793,0.164 0.5,0 0.991,-0.188 1.369,-0.541 l 2.463,-2.311 2.377,5.516 c 0.211,0.489 0.61,0.874 1.104,1.069 0.235,0.093 0.484,0.139 0.732,0.139 0.274,0 0.549,-0.057 0.806,-0.169 l 2.406,-1.059 c 0.489,-0.215 0.873,-0.618 1.063,-1.118 0.19,-0.501 0.173,-1.056 -0.05,-1.543 l -2.498,-5.47 3.544,-0.322 c 0.785,-0.07 1.454,-0.596 1.711,-1.342 0.256,-0.744 0.051,-1.57 -0.524,-2.109 L 8.367,0.554 C 7.989,0.2 7.498,0.014 7,0.014 Z"
				/>
			</svg>
			<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26">
				<path
					style="fill:#000000;stroke:none;stroke-opacity:1;fill-opacity:1"
					d="M 7,0.014 C 6.73,0.014 6.46,0.068 6.203,0.18 5.472,0.497 4.999,1.219 5,2.017 l 0.026,18.127 c 0.001,0.797 0.476,1.518 1.206,1.834 0.256,0.109 0.525,0.164 0.793,0.164 0.5,0 0.991,-0.188 1.369,-0.541 l 2.463,-2.311 2.377,5.516 c 0.211,0.489 0.61,0.874 1.104,1.069 0.235,0.093 0.484,0.139 0.732,0.139 0.274,0 0.549,-0.057 0.806,-0.169 l 2.406,-1.059 c 0.489,-0.215 0.873,-0.618 1.063,-1.118 0.19,-0.501 0.173,-1.056 -0.05,-1.543 l -2.498,-5.47 3.544,-0.322 c 0.785,-0.07 1.454,-0.596 1.711,-1.342 0.256,-0.744 0.051,-1.57 -0.524,-2.109 L 8.367,0.554 C 7.989,0.2 7.498,0.014 7,0.014 Z"
				/>
				<path
					style="fill:#ffffff;stroke:none;stroke-opacity:1;fill-opacity:1"
					d="m 7,2.014 13.162,12.328 -5.377,0.488 -0.977,0.088 0.406,0.894 3.263,7.145 -2.406,1.058 -3.113,-7.222 -0.391,-0.91 -0.722,0.678 L 7.026,20.143 7,2.014"
				/>
			</svg>
		</div>
	`);

	const {location} = window;
	if(location.hash.toLowerCase().replace(/#/g, "") === "neutrona") {$('#ghostbuster-main').toggleClass('active');}
	$('#ghostbuster-tab').click(() => $('#ghostbuster-main').toggleClass('active'));
};

initializeGhostBusterPanel();

const addStep = function(step) {
	const listItemElQ = $(`<li id="${step.id}" title="Execute until and including this step" class="step">${step.description}</li>`);
	const playButtonElQ = $('<i class="icon-play4"></i>');
	listItemElQ.prepend(playButtonElQ);

	$('.ghostbuster-contents .steps').append(listItemElQ);
	//listItemElQ.on('click', cb);
};

const addScenario = (scenario) => {
	$('.ghostbuster-contents .scenario')
		.text(scenario.description)
		.prepend('<i class="icon-play4"></i>')
		.attr('title', "Execute all steps in the scenario")
		.on('click', () => Runner.runScenario(scenario, 0.2))
		// .on('click', () => GhostBuster.runScenario(scenario, 2))
		// .on('click', () => {AWF.Bus.resetAWF();$('.step').click()})
		// .on('click', () => {$('.step').click()})
	;


	scenario.steps.forEach(addStep);
};

// namespace("GhostBuster.UI", {
// 	addScenario,
// });

Bus.on('scenariosChanged', (_, scenarios) => addScenario(scenarios[0]));
Bus.on('executingScenario', () => $('#ghostbuster-cursor').addClass('active'));
Bus.on('scenarioExecuted', () => $('#ghostbuster-cursor').removeClass('active'));
Bus.on('click', () => {
	$('#ghostbuster-cursor').addClass('clicking');
	window.setTimeout(() => $('#ghostbuster-cursor').removeClass('clicking'), 250);
});
Bus.on('executingScenario', (_, scenario) => {
	console.log('scenar', scenario);
	scenario.steps.forEach((step) => {
		$(`#${step.id}`).removeClass('completed');
	});
});
Bus.on('executingStep', (_, step) => {
	$(`#${step.id}`)
		.addClass('active')
	;
});
Bus.on('stepExecuted', (_, step) => {
	console.log('stepExecuted', step);
	$(`#${step.id}`)
		.removeClass('active')
		.addClass('completed')
	;
});

// Audio stuff
window.responsiveVoice = {speak(text, voice, options){$.isFunction(options.onend) && options.onend();}};
// $('body').append("<script src='https://code.responsivevoice.org/responsivevoice.js'></script>");
// GhostBuster.Bus.on('executingScenario', (_, scenario, promise) => {
// 	promise.then(say("How to " + scenario.description));
// 	// responsiveVoice.speak(scenario.description);
// });
// GhostBuster.Bus.on('executingStep', (_, step, promise) => {
// 	promise.then(say(step.description));
// 	// responsiveVoice.speak(step.description);
// });
