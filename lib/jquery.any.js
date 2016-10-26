const $ = require('./jquery.js');

/**
* @augments jQuery
*/
$.fn.any = () => {
	return (this.length > 0);
};
