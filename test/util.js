var Util = {
	privateClass: function(name) {
		return $.fn.vanillabox.privateClasses_[name];
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
