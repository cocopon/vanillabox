const IframeContent = require('./iframe_content.js');
const ImageContent = require('./image_content.js');

/**
 * @alias ContentFactory
 */
class ContentFactory {
	static create(target, options) {
		const factoryFn = ContentFactory.FACTORIES_[options.type];

		if (!factoryFn) {
			throw new VanillaException(VanillaException.Types.INVALID_TYPE);
		}

		return factoryFn(target, options);
	}
}

ContentFactory.FACTORIES_ = {
	'image': (target) => {
		return new ImageContent({
			path: target.attr('href'),
			title: target.attr('title')
		});
	},
	'iframe': (target, options) => {
		return new IframeContent({
			path: target.attr('href'),
			preferredWidth: options.preferredWidth,
			preferredHeight: options.preferredHeight,
			title: target.attr('title')
		});
	}
};

module.exports = ContentFactory;
