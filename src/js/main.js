const AnimationProvider = require('./animationprovider.js');
const DefaultConfig = require('./default_config.js');
const Vanillabox = require('./vanillabox.js');

$.fn.vanillabox = function(opt_config) {
	var config = {};
	$.extend(config, DefaultConfig);
	$.extend(config, opt_config);

	var targetElems = $(this);
	var animation = AnimationProvider.get(config['animation']);

	var box = new Vanillabox({
		animation: animation,
		closeButton: config['closeButton'],
		adjustToWindow: config['adjustToWindow'],
		keyboard: config['keyboard'],
		loop: config['loop'],
		preferredHeight: config['preferredHeight'],
		preferredWidth: config['preferredWidth'],
		repositionOnScroll: config['repositionOnScroll'],
		targets: targetElems,
		type: config['type'],
		grouping: config['grouping']
	});

	return box;
};

require('./test.js');
