const Content = require('./content.js');
const Util = require('./util.js');

/**
 * @constructor
 * @extends Content
 */
class IframeContent extends Content {
	constructor(opt_config) {
		const config = opt_config || {};

		super(config);

		this.preferredWidth_ = config.preferredWidth;
		this.preferredHeight_ = config.preferredHeight;
	};

	setupInternal_() {
		const iframeElem = $('<iframe>');
		iframeElem.attr({
			'frameborder': 0,  // Need to disable border in IE
			'allowfullscreen': true
		});
		this.elem_.append(iframeElem);
		this.iframeElem_ = iframeElem;
	}

	dispose() {
		super.dispose();

		this.iframeElem_ = null;
	}

	shouldUnloadOnHide() {
		return true;
	}

	attach_() {
		const iframeElem = this.iframeElem_;
		iframeElem.on('load', $.proxy(this.onLoad_, this));
		iframeElem.on('error', $.proxy(this.onError_, this));
	}

	detach_() {
		const iframeElem = this.iframeElem_;
		iframeElem.off('load', this.onLoad_);
		iframeElem.off('error', this.onError_);
	}

	getFlexibleElement() {
		// In iOS, cannot restrict a size of an iframe element
		// so return an outer element instead
		return Util.Browser.isIos() ?
			this.getElement() :
			this.iframeElem_;
	}

	getSize() {
		const elem = this.getFlexibleElement();
		return {
			width: elem.width(),
			height: elem.height()
		};
	}

	setMaxContentSize(width, height) {
		const elem = this.getFlexibleElement();
		elem.css({
			maxWidth: width,
			maxHeight: height
		});
	}

	loadInternal_() {
		this.iframeElem_.attr('src', this.path_);
	}

	unloadInternal_() {
		this.iframeElem_.attr('src', IframeContent.EMPTY_SRC);

		const elem = this.getFlexibleElement();
		elem.width('');
		elem.height('');
	}

	onLoad_() {
		const iframeElem = this.iframeElem_;

		const src = iframeElem.attr('src');
		if (!src) {
			// Ignore unwanted load event that is fired when appending to DOM
			return;
		}
		if (src === IframeContent.EMPTY_SRC) {
			return;
		}

		const elem = this.getFlexibleElement();
		elem.width(this.preferredWidth_);
		elem.height(this.preferredHeight_);

		this.onComplete_(true);
	}

	onError_() {
		this.onComplete_(false);
	}
}

IframeContent.EMPTY_SRC = 'about:blank';

module.exports = IframeContent;
