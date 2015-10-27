/**
 * @namespace
 */
const Util = {
	/**
	 * @constant
	 * @type {String}
	 */
	ROOT_CSS: 'vnbx',

	/**
	 * @constant
	 * @type {String}
	 */
	CSS_PREFIX: 'vnbx-',

	/**
	 * @constant
	 * @type {String}
	 */
	EVENT_PREFIX: 'vnbx_',

	/**
	 * @param {*} value
	 * @return {Boolean} true if the value is defined
	 */
	isDefined: (value) => {
		return value !== undefined;
	},

	/**
	 * @param {*} value
	 * @param {*} defaultValue
	 * @return {*}
	 */
	getOrDefault: (value, defaultValue) => {
		return Util.isDefined(value) ?
			value :
			defaultValue;
	}
};

Util.Array = {
	forEach: (array, fn, opt_scope) => {
		const scope = opt_scope || this;
		const len = array.length;

		for (let i = 0; i < len; i++) {
			fn.call(scope, array[i], i);
		}
	},

	map: (array, fn, opt_scope) => {
		const scope = opt_scope || this;
		const result = [];
		const len = array.length;

		for (let i = 0; i < len; i++) {
			result.push(fn.call(scope, array[i], i));
		}

		return result;
	},

	indexOf: (array, item) => {
		const len = array.length;

		for (let i = 0; i < len; i++) {
			if (array[i] === item) {
				return i;
			}
		}
		return -1;
	}
};

Util.Deferred = {
	emptyPromise: () => {
		const d = new $.Deferred();

		setTimeout(() => {
			d.resolve();
		}, 0);

		return d.promise();
	}
};

Util.Dom = {
	getViewportWidth: () => {
		return window.innerWidth ||
			document.documentElement.clientWidth;
	},

	getViewportHeight: () => {
		return window.innerHeight ||
			document.documentElement.clientHeight;
	}
};

Util.Browser = {
	isIos: () => {
		const ua = navigator.userAgent;
		return !!ua.match(/(ipod|iphone|ipad)/ig);
	}
};

module.exports = Util;
