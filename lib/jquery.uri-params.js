const $ = window.jQuery || require('jquery');

if(!$.uriParams) {
	/**
	 * uriParams jQuery plugin: get the uri parameters from the window.location.search string as a hashmap
	 */
	let uriParams;
	$.uriParams = (name) => {
		uriParams = uriParams || (
			(function getUriParamsFromLocation() {
				const uriParams = {};
				let e;
				const a = /\+/g;  // Regex for replacing addition symbol with a space
				const r = /([^&=]+)=?([^&]*)/g;
				const d = function (s) {
					return decodeURIComponent(s.replace(a, " "));
				};
				const q = window.document.location.search.substring(1);

				// eslint-disable-next-line no-cond-assign
				while (e = r.exec(q))
					uriParams[d(e[1])] = d(e[2]);

				return uriParams;
			})()
		);

		if(name) {
			return uriParams[name];
		} else {
			return uriParams;
		}
	};
}
