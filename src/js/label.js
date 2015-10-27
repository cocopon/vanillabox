const Util = require('./util.js');

/**
 * @constructor
 */
class Label {
	constructor(config) {
		this.cls_ = config.cls;

		this.setup_();
	};

	setup_() {
		const elem = $('<div>');
		elem.addClass(Util.CSS_PREFIX + 'label');
		if (this.cls_) {
			elem.addClass(this.cls_);
		}
		this.elem_ = elem;
	};

	dispose() {
		this.elem_ = null;
	};

	getElement() {
		return this.elem_;
	};

	getText() {
		return this.elem_.text();
	};

	setText(text) {
		this.elem_.text(text);
	};
}

module.exports = Label;
