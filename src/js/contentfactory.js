/**
 * @alias ContentFactory
 */
var ContentFactory = {
	FACTORIES_: {
		'image': function(target, options) {
			return new ImageContent({
				path: target.attr('href'),
				title: target.attr('title')
			});
		},
		'iframe': function(target, options) {
			return new IframeContent({
				path: target.attr('href'),
				preferredWidth: options.preferredWidth,
				preferredHeight: options.preferredHeight,
				title: target.attr('title')
			});
		}
	},

	create: function(target, options) {
		var factoryFn = ContentFactory.FACTORIES_[options.type];

		if (!factoryFn) {
			throw new VanillaException(VanillaException.Types.INVALID_TYPE);
		}

		return factoryFn(target, options);
	}
};

