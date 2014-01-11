/**
 * @namespace
 */
var Util = {
	/**
	 * @constant
	 * @type {Function}
	 */
	EMPTY_FN: function() {},

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
	isDefined: function(value) {
		return value !== undefined;
	},

	/**
	 * @param {*} value
	 * @param {*} defaultValue
	 * @return {*}
	 */
	getOrDefault: function(value, defaultValue) {
		return Util.isDefined(value) ?
			value :
			defaultValue;
	},

	/**
	 * @param {Function} Child
	 * @param {Function} Parent
	 */
	inherits: function(Child, Parent) {
		var Tmp = function() {};
		Tmp.prototype = Parent.prototype;

		Child.prototype = new Tmp();
		Child.prototype.constructor = Child;
	}
};

Util.Array = {
	forEach: function(array, fn, opt_scope) {
		var scope = opt_scope || this;
		var len = array.length;
		var i;

		for (i = 0; i < len; i++) {
			fn.call(scope, array[i], i);
		}
	},

	map: function(array, fn, opt_scope) {
		var scope = opt_scope || this;
		var result = [];
		var len = array.length;
		var i;

		for (i = 0; i < len; i++) {
			result.push(fn.call(scope, array[i], i));
		}

		return result;
	},

	indexOf: function(array, item) {
		var len = array.length;
		var i;

		for (i = 0; i < len; i++) {
			if (array[i] === item) {
				return i;
			}
		}
		return -1;
	}
};

Util.Deferred = {
	emptyPromise: function() {
		var d = new $.Deferred();

		setTimeout(function() {
			d.resolve();
		}, 0);

		return d.promise();
	}
};

Util.Dom = {
	getViewportWidth: function() {
		return window.innerWidth ||
			document.documentElement.clientWidth;
	},

	getViewportHeight: function() {
		return window.innerHeight ||
			document.documentElement.clientHeight;
	}
};

Util.Browser = {
	isIos: function() {
		var ua = navigator.userAgent;
		return !!ua.match(/(ipod|iphone|ipad)/ig);
	}
};

