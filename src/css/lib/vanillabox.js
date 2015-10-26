const sass = require('node-sass');

module.exports = {
	'high_res($url, $ratio)': function(url, ratio) {
		const str = url.getValue();
		let index = str.lastIndexOf('.');
		if (index < 0) {
			index = str.length();
		}

		const highResStr = str.slice(0, index) +
			`@${ratio.getValue()}x` +
				str.slice(index);
		return sass.types.String(highResStr);
	}
};
