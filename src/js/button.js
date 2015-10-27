const Events = require('./events.js');
const Util = require('./util.js');

/**
 * @constructor
 */
class Button {
	constructor(config) {
		this.cls_ = config.cls;
		this.disabled_ = Util.getOrDefault(config.disabled, false);

		this.setup_();
	}

	setup_() {
		const elem = $('<div>');
		elem.addClass(Util.CSS_PREFIX + 'button');
		if (this.cls_) {
			elem.addClass(this.cls_);
		}

		// Enable :active pseudo-class on touch device
		elem.attr('ontouchstart', 'void(0)');

		this.elem_ = elem;

		this.attach_();
	}

	dispose() {
		this.elem_ = null;
	}

	attach_() {
		const elem = this.getElement();
		elem.on('click', $.proxy(this.onClick_, this));
	}

	detach_() {
		const elem = this.getElement();
		elem.off('click', this.onClick_);
	}

	getElement() {
		return this.elem_;
	}

	isDisabled() {
		return this.disabled_;
	}

	setDisabled(disabled) {
		const elem = this.elem_;

		this.disabled_ = disabled;

		if (this.disabled_) {
			elem.addClass(Util.CSS_PREFIX + 'disabled');
		}
		else {
			elem.removeClass(Util.CSS_PREFIX + 'disabled');
		}
	}

	onClick_(e) {
		e.stopPropagation();

		if (!this.isDisabled()) {
			$(this).trigger(Events.CLICK);
		}
	}
}

module.exports = Button;
