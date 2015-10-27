const Content = require('./content.js');

/**
 * @constructor
 * @extends Content
 */
class ImageContent extends Content {
	constructor(opt_config) {
		super(opt_config);
	};

	setupInternal_() {
		const imgElem = $('<img>');
		this.elem_.append(imgElem);
		this.imgElem_ = imgElem;
	}

	dispose() {
		super.dispose();
		this.imgElem_ = null;
	}

	attach_() {
		const imgElem = this.imgElem_;
		imgElem.on('load', $.proxy(this.onLoad_, this));
		imgElem.on('error', $.proxy(this.onError_, this));
	}

	detach_() {
		const imgElem = this.imgElem_;
		imgElem.off('load', this.onLoad_);
		imgElem.off('error', this.onError_);
	}

	setMaxContentSize(width, height) {
		this.imgElem_.css({
			maxWidth: width,
			maxHeight: height
		});
	}

	loadInternal_() {
		this.imgElem_.attr('src', this.path_);
	}

	unloadInternal_() {
		this.imgElem_.attr('src', ImageContent.EMPTY_SRC);
	}

	onLoad_() {
		if (this.imgElem_.attr('src') === ImageContent.EMPTY_SRC) {
			return;
		}

		this.onComplete_(true);
	};

	onError_() {
		this.onComplete_(false);
	}
}

ImageContent.EMPTY_SRC = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

module.exports = ImageContent;
