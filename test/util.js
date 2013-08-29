var Util = {
	privateClass: function(name) {
		return $.fn.vanillabox.privateClasses_[name];
	},

	cssClass: function(name) {
		var prefix = Util.privateClass('Util').CSS_PREFIX;
		return '.' + prefix + name;
	},

	targets: function(totalTargets) {
		var elems = [];
		var len = totalTargets;
		var i;
		var elem;

		for (i = 0; i < len; i++) {
			elem = $('<a>');
			elem.attr({
				href: 'about:blank'
			});

			elems.push(elem);
		}

		return $(elems);
	}
};
