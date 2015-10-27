const AnimationProvider = require('./animationprovider.js');
const DefaultConfig = require('./default_config.js');
const Vanillabox = require('./vanillabox.js');

$.fn.vanillabox = function(opt_config) {
	let config = {};
	$.extend(config, DefaultConfig);
	$.extend(config, opt_config);

	const targetElems = $(this);
	const animation = AnimationProvider.get(config['animation']);

	const box = new Vanillabox({
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
