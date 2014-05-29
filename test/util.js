var Util = {
	privateClass: function(name) {
		return $.fn.vanillabox.privateClasses_[name];
	},

	cssClass: function(name) {
		var prefix = Util.privateClass('Util').CSS_PREFIX;
		return '.' + prefix + name;
	},

	generateTargetElements: function(totalTargets, opt_href) {
		var href = (opt_href === undefined) ? 'about:blank' : opt_href;
		var elems = [];
		var len = totalTargets;
		var i;
		var elem;

		for (i = 0; i < len; i++) {
			elem = $('<a>');
			elem.attr({
				href: href
			});

			elems.push(elem);
		}

		return $(elems);
	},

	getPagerOfBox: function(box) {
		return box.pager_;
	},

	getContentsOfBox: function(box) {
		return box.contents_;
	}
};
