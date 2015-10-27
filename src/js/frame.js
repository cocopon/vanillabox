const Container = require('./container.js');
const Util = require('./util.js');

/**
 * @constructor
 */
class Frame {
	constructor(opt_config) {
		const config = opt_config || {};

		const container = new Container({
			animation: config.animation,
			adjustToWindow: config.adjustToWindow
		});
		this.container_ = container;

		this.setup_();
		this.attach_();
	}

	setup_() {
		const elem = $('<div>');
		elem.addClass(Util.CSS_PREFIX + 'frame');
		this.elem_ = elem;

		const container = this.container_;
		this.elem_.append(container.getElement());
	}

	dispose() {
		this.container_.dispose();
		this.container_ = null;

		this.detach_();
		this.elem_ = null;
	}

	attach_() {
		this.elem_.on('click', $.proxy(this.onClick_, this));
	}

	detach_() {
		this.elem_.off('click', this.onClick_);
	}

	getElement() {
		return this.elem_;
	}

	getContainer() {
		return this.container_;
	}

	getPreferredOffset(contentSize) {
		const container = this.getContainer();
		const containerElem = container.getElement();

		// Save current size
		const w = containerElem.width();
		const h = containerElem.height();

		// Set specified size temporarily
		containerElem.width(contentSize.width);
		containerElem.height(contentSize.height);

		// Get preferred position
		const $window = $(window);
		const elem = this.getElement();
		const ow = Util.Dom.getViewportWidth();
		const oh = Util.Dom.getViewportHeight();
		const left = Math.round($window.scrollLeft() + (ow - elem.outerWidth()) / 2);
		const top = Math.max(Math.round($window.scrollTop() + (oh - elem.outerHeight()) / 2), 0);

		// Restore original size
		containerElem.width(w);
		containerElem.height(h);

		return {
			left: left,
			top: top
		};
	}

	onClick_(e) {
		e.stopPropagation();
	}
}

Frame.RESIZE_TIMEOUT_DELAY = 500;

module.exports = Frame;
