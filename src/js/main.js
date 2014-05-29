var DEFAULT_CONFIG = {
	'animation': 'default',
	'closeButton': false,
	'adjustToWindow': 'both',
	'keyboard': true,
	'loop': false,
	'preferredHeight': 600,
	'preferredWidth': 800,
	'repositionOnScroll': false,
	'type': 'image'
};

$.fn.vanillabox = function(opt_config) {
	var config = {};
	$.extend(config, DEFAULT_CONFIG);
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
		type: config['type']
	});

	return box;
};

