const Events = require('./events.js');
const Util = require('./util.js');

/**
 * @constructor
 */
class Content {
	constructor(opt_config) {
		const config = opt_config || {};

		this.loaded_ = false;
		this.success_ = false;

		this.path_ = config.path;
		this.title_ = Util.getOrDefault(config.title, '');

		this.setup_();
	}

	setup_() {
		const elem = $('<div>');
		elem.addClass(Util.CSS_PREFIX + 'content');
		this.elem_ = elem;

		this.setupInternal_();
		this.attach_();
	}

	setupInternal_() {}
	attach_() {}
	detach_() {}

	dispose() {
		this.detach_();
		this.elem_.remove();
		this.elem_ = null;
	}

	shouldUnloadOnHide() {
		return false;
	}

	isLoaded() {
		return this.loaded_;
	}

	getElement() {
		return this.elem_;
	}

	getTitle() {
		return this.title_;
	}

	getSize() {
		const elem = this.getElement();

		return {
			width: elem.width(),
			height: elem.height()
		};
	}

	setOffset(left, top) {
		const elem = this.getElement();

		elem.css({
			marginLeft: left,
			marginTop: top
		});
	}

	setMaxContentSize(width, height) {
		this.getElement().css({
			maxWidth: width,
			maxHeight: height
		});
	}

	load() {
		const elem = this.getElement();

		elem.addClass(Util.CSS_PREFIX + 'loading');

		if (this.loaded_) {
			this.onComplete_(this.success_);
			return;
		}

		this.loadInternal_();
	}

	loadInternal_() {}

	unload() {
		this.unloadInternal_();
		this.loaded_ = false;
	}

	unloadInternal_() {}

	onComplete_(success) {
		const elem = this.getElement();

		this.loaded_ = true;
		this.success_ = success;

		elem.removeClass(Util.CSS_PREFIX + 'loading');
		if (!success) {
			elem.addClass(Util.CSS_PREFIX + 'error');
		}

		$(this).trigger(Events.COMPLETE, success);
	}
}

module.exports = Content;
