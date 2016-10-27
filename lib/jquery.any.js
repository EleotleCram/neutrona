const $ = window.jQuery || require('jquery');

if(!$.fn.any) {
	/**
	* @augments jQuery
	*/
	$.fn.any = () => {
		return (this.length > 0);
	};
}
