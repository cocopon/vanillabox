const Events = require('./events.js');
const Util = require('./util.js');

/**
 * @constructor
 */
class Mask {
	constructor() {
		this.setup_();
	}

	setup_() {
		const $elem = $('<div>');
		$elem.addClass(Util.CSS_PREFIX + 'mask');

		this.elem_ = $elem;
		this.attach_();
	}

	dispose() {
		this.detach_();
		this.elem_ = null;
	}

	attach_() {
		$(window).on('resize', $.proxy(this.onWindowResize_, this));

		const elem = this.getElement();
		elem.on('click', $.proxy(this.onClick_, this));
	}

	detach_() {
		$(window).off('resize', this.onWindowResize_);

		const elem = this.getElement();
		elem.off('click', this.onClick_);
	}

	getElement() {
		return this.elem_;
	}

	layout() {
		const elem = this.getElement();

		elem.width('');
		elem.height('');

		const $window = $(window);
		const $document = $(document);
		const w = Math.max($document.width(), $window.width());
		const h = Math.max($document.height(), $window.height());

		elem.width(w);
		elem.height(h);
	}

	onWindowResize_() {
		this.layout();
	}

	onClick_() {
		$(this).trigger(Events.CLICK);
	}
}

module.exports = Mask;
