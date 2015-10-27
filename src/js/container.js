const AnimationProvider = require('./animationprovider.js');
const Events = require('./events.js');
const Util = require('./util.js');

/**
 * @constructor
 */
class Container {
	constructor(opt_config) {
		const config = opt_config || {};

		this.animation_ = Util.getOrDefault(config.animation, AnimationProvider.getDefault());
		this.adjustToWindow_ = Util.getOrDefault(config.adjustToWindow, 'both');

		this.setup_();
	}

	setup_() {
		const elem = $('<div>');
		elem.addClass(Util.CSS_PREFIX + 'container');
		this.elem_ = elem;

		this.attach_();
	}

	dispose() {
		this.detach_();
		this.elem_ = null;
	};

	attach_() {
	};

	detach_() {
		this.detachContent_();
	};

	attachContent_() {
		const content = this.getContent();

		$(content).on(Events.COMPLETE, $.proxy(this.onContentComplete_, this));
	};

	detachContent_() {
		const content = this.getContent();
		if (!content) {
			return;
		}

		$(content).off(Events.COMPLETE, this.onContentComplete_);
	};

	getElement() {
		return this.elem_;
	};

	getContent() {
		return this.content_;
	};

	setContent(content) {
		const animation = this.animation_;

		if (content === this.content_) {
			return;
		}

		if (this.content_) {
			this.detachContent_();

			const prevContent = this.content_;
			animation.hideContent(prevContent).done(() => {
				this.onContentHide_(prevContent);
			});
		}

		this.content_ = content;
		if (!this.content_) {
			return;
		}

		this.attachContent_();

		if (this.maxContentSize_) {
			this.applyMaxContentSize_();
		}

		const elem = this.getElement();
		const contentElem = this.content_.getElement();
		const contentElems = elem.find('> *');
		if (contentElems.length === 0) {
			elem.append(contentElem);
		}
		else {
			// Insert newer content behind all existing contents
			contentElem.insertBefore(contentElems.first());
		}

		animation.showContent(this.content_).done(() => {
			this.onContentShow_();
		});
	};

	getSize() {
		const content = this.getContent();

		let contentSize = {
			width: 0,
			height: 0
		};
		if (content) {
			contentSize = content.getSize();
		}

		return {
			width: Math.max(contentSize.width, Container.MIN_WIDTH),
			height: Math.max(contentSize.height, Container.MIN_HEIGHT)
		};
	};

	needsAdjustment(direction) {
		return this.adjustToWindow_ === true
			|| this.adjustToWindow_ === 'both'
			|| this.adjustToWindow_ === direction;
	}

	updateMaxContentSize_() {
		const safetyMargin = Container.CONTENT_SIZE_SAFETY_MARGIN;
		this.maxContentSize_ = {
			width: this.needsAdjustment('horizontal')
				? (Util.Dom.getViewportWidth() - safetyMargin)
				: Number.MAX_VALUE,
			height: this.needsAdjustment('vertical')
				? (Util.Dom.getViewportHeight() - safetyMargin)
				: Number.MAX_VALUE
		};

		const content = this.content_;
		if (!content) {
			return;
		}

		this.applyMaxContentSize_();
	};

	applyMaxContentSize_() {
		const content = this.getContent();
		const maxSize = this.maxContentSize_;

		content.setMaxContentSize(
			Math.max(maxSize.width, Container.MIN_WIDTH),
			Math.max(maxSize.height, Container.MIN_HEIGHT)
		);
	};

	layout() {
		const content = this.getContent();
		const contentSize = content.getSize();

		content.setOffset(
			-Math.round(contentSize.width / 2),
			-Math.round(contentSize.height / 2)
		);
	};

	onContentComplete_() {
		this.layout();
	};

	onContentShow_() {
		$(this).trigger(Events.CONTENT_SHOW, [
			this,
			this.getContent()
		]);
	};

	onContentHide_(content) {
		$(this).trigger(Events.CONTENT_HIDE, [
			this,
			content
		]);
	};
}

Container.CONTENT_SIZE_SAFETY_MARGIN = 100;
Container.MIN_WIDTH = 200;
Container.MIN_HEIGHT = 150;

module.exports = Container;
