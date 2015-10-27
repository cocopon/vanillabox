const AnimationProvider = require('./animation_provider.js');
const Button = require('./button.js');
const ContentFactory = require('./content_factory.js');
const EmptyContent = require('./empty_content.js');
const Events = require('./events.js');
const Frame = require('./frame.js');
const Label = require('./label.js');
const Mask = require('./mask.js');
const Pager = require('./pager.js');
const Util = require('./util.js');
const VanillaException = require('./exception.js');

/**
 * @param {Object} config Config options.
 * @constructor
 */
class Vanillabox {
	constructor(config) {
		if (!config.targets || config.targets.length === 0) {
			throw new VanillaException(VanillaException.Types.NO_IMAGE);
		}

		this.showed_ = false;

		this.targetElems_ = config.targets;
		this.animation_ = Util.getOrDefault(
			config.animation,
			AnimationProvider.getDefault()
		);
		this.repositionOnScroll_ = config.repositionOnScroll;
		this.supportsKeyboard_ = config.keyboard;
		this.closeButtonEnabled_ = config.closeButton;
		this.adjustToWindow_ = config.adjustToWindow;
		this.grouping_ = config.grouping;

		this.contentOptions_ = {
			preferredWidth: config.preferredWidth,
			preferredHeight: config.preferredHeight,
			type: config.type
		};

		this.pager_ = new Pager({
			loop: config.loop,
			totalPages: this.targetElems_.length
		});

		this.setup_();
	}

	/** @private */
	setup_() {
		const mask = new Mask();
		const maskElem = mask.getElement();
		maskElem.addClass(Util.ROOT_CSS);
		maskElem.hide();
		$('body').append(maskElem);
		this.mask_ = mask;

		this.setupRootCss_();

		const frame = new Frame({
			animation: this.animation_,
			adjustToWindow: this.adjustToWindow_
		});
		const frameElem = frame.getElement();
		this.frame_ = frame;
		maskElem.append(frameElem);

		const titleLabel = new Label({
			cls: Util.CSS_PREFIX + 'title'
		});
		this.titleLabel_ = titleLabel;
		frameElem.append(titleLabel.getElement());

		const pagerLabel = new Label({
			cls: Util.CSS_PREFIX + 'pager'
		});
		this.pagerLabel_ = pagerLabel;
		frameElem.append(pagerLabel.getElement());

		const prevButton = new Button({
			cls: Util.CSS_PREFIX + 'prev'
		});
		this.prevButton_ = prevButton;
		frameElem.append(prevButton.getElement());

		const nextButton = new Button({
			cls: Util.CSS_PREFIX + 'next'
		});
		this.nextButton_ = nextButton;
		frameElem.append(nextButton.getElement());

		const closeButton = new Button({
			cls: Util.CSS_PREFIX + 'close'
		});
		if (!this.closeButtonEnabled_) {
			closeButton.getElement().hide();
		}
		this.closeButton_ = closeButton;
		frameElem.append(closeButton.getElement());

		this.attach_();

		this.setupContents_();
	}

	/** @private */
	setupRootCss_() {
		const rootElem = this.mask_.getElement();

		if (Util.Browser.isIos()) {
			rootElem.addClass(Util.CSS_PREFIX + 'ios');
		}
		if (this.closeButtonEnabled_) {
			rootElem.addClass(Util.CSS_PREFIX + 'close-button-enabled');
		}
		if (this.grouping_ && this.pager_.getTotalPages() > 1) {
			rootElem.addClass(Util.CSS_PREFIX + 'group');
		}
	}

	/**
	* Disposes the component.
	*/
	dispose() {
		this.detachWindow_();
		this.detach_();

		this.disposeAllContents_();

		this.titleLabel_.dispose();
		this.titleLabel_ = null;

		this.pagerLabel_.dispose();
		this.pagerLabel_ = null;

		this.closeButton_.dispose();
		this.closeButton_ = null;

		this.prevButton_.dispose();
		this.prevButton_ = null;

		this.nextButton_.dispose();
		this.nextButton_ = null;

		this.frame_.dispose();
		this.frame_ = null;

		this.mask_.getElement().remove();
		this.mask_.dispose();
		this.mask_ = null;
	}

	/** @private */
	setupContents_() {
		this.contents_ = Util.Array.map(this.targetElems_, (target) => {
			const targetElem = $(target);
			return ContentFactory.create(targetElem, this.contentOptions_);
		});

		const emptyContent = new EmptyContent();
		this.setContent_(emptyContent);
	}

	/** @private */
	disposeAllContents_() {
		const container = this.frame_.getContainer();
		container.setContent(null);

		if (this.contents_) {
			Util.Array.forEach(this.contents_, (content) => {
				content.dispose();
			});
			this.contents_ = null;
		}
	}

	/** @private */
	attach_() {
		this.targetElems_.on('click', $.proxy(this.onTargetElementClick_, this));

		$(this.mask_).on(Events.CLICK, $.proxy(this.onMaskClick_, this));

		const container = this.frame_.getContainer();
		$(container).on(Events.CONTENT_HIDE, $.proxy(this.onContentHide_, this));

		const pager = this.pager_;
		$(pager).on(Events.CHANGE, $.proxy(this.onPagerChange_, this));

		$(this.closeButton_).on(Events.CLICK, $.proxy(this.onCloseButtonClick_, this));
		$(this.prevButton_).on(Events.CLICK, $.proxy(this.onPreviousButtonClick_, this));
		$(this.nextButton_).on(Events.CLICK, $.proxy(this.onNextButtonClick_, this));
	}

	/** @private */
	detach_() {
		this.targetElems_.off('click', this.onTargetElementClick_);

		$(this.mask_).off(Events.CLICK, this.onMaskClick_);

		const container = this.frame_.getContainer();
		$(container).off(Events.CONTENT_HIDE, this.onContentHide_);

		const pager = this.pager_;
		$(pager).off(Events.CHANGE, this.onPagerChange_);

		$(this.closeButton_).off(Events.CLICK, this.onCloseButtonClick_);
		$(this.prevButton_).off(Events.CLICK, this.onPreviousButtonClick_);
		$(this.nextButton_).off(Events.CLICK, this.onNextButtonClick_);

		this.detachContent_();
		this.content_ = null;
	}

	/** @private */
	attachWindow_() {
		const $window = $(window);
		const $document = $(document);

		$window.on('resize', $.proxy(this.onWindowResize_, this));
		$window.on('scroll', $.proxy(this.onWindowScroll_, this));
		$document.on('keyup', $.proxy(this.onDocumentKeyUp_, this));
	}

	/** @private */
	detachWindow_() {
		const $window = $(window);
		const $document = $(document);

		$window.off('resize', this.onWindowResize_, this);
		$window.off('scroll', this.onWindowScroll_, this);
		$document.off('keyup', this.onDocumentKeyUp_, this);
	}

	/** @private */
	attachContent_() {
		const content = this.getContent_();
		$(content).on(Events.COMPLETE, $.proxy(this.onContentComplete_, this));

		const contentElem = content.getElement();
		contentElem.on('click', $.proxy(this.onContentClick_, this));
	}

	/** @private */
	detachContent_() {
		const content = this.getContent_();
		if (!content) {
			return;
		}
		$(content).off('complete', this.onContentComplete_);

		const contentElem = content.getElement();
		contentElem.off('click', this.onContentClick_);
	}

	/**
	* Shows the component.
	* @param {Number} opt_index Index of a content to show.
	* @return {Promise} Promise object for showing animation.
	*/
	show(opt_index) {
		const animation = this.animation_;

		if (this.showed_) {
			return Util.Deferred.emptyPromise();
		}
		this.showed_ = true;

		if (this.contents_ === null) {
			this.setupContents_();
		}

		this.attachWindow_();

		const container = this.frame_.getContainer();
		container.updateMaxContentSize_();

		const mask = this.mask_;
		mask.layout();
		const maskPromise = animation.showMask(mask);

		const framePromise = animation.showFrame(this.frame_);

		const pager = this.pager_;
		const index = Util.getOrDefault(opt_index, 0);
		const triggeredPagerEvent = (index !== pager.getPage());
		pager.setPage(index);
		if (!triggeredPagerEvent) {
			this.updateContent_();
		}

		return $.when(
			maskPromise,
			framePromise
		).then(() => {
			$(this).trigger(Events.SHOW);
		});
	}

	/**
	* Hides the component.
	* @return {Promise} promise Promise object for hiding operation.
	*/
	hide() {
		if (!this.showed_) {
			return Util.Deferred.emptyPromise();
		}

		return $.when(
			this.animation_.hideFrame(this.frame_),
			this.animation_.hideMask(this.mask_)
		).then(() => {
			this.detachWindow_();
			this.showed_ = false;

			Util.Array.forEach(this.contents_, (content) => {
				if (content.shouldUnloadOnHide()) {
					content.unload();
				}
			});

			$(this).trigger(Events.HIDE);
		});
	}

	/** @private */
	setTitle_(title) {
		const titleLabel = this.titleLabel_;

		titleLabel.setText(title);
	}

	/**
	* Shows the previous content.
	*/
	previous() {
		if (!this.grouping_) {
			return;
		}

		this.pager_.previous();
	}

	/**
	* Shows the next content.
	*/
	next() {
		if (!this.grouping_) {
			return;
		}

		this.pager_.next();
	}

	/** @private */
	getContent_() {
		const container = this.frame_.getContainer();

		return container.getContent();
	}

	/** @private */
	setContent_(content) {
		const container = this.frame_.getContainer();

		const prevContent = this.getContent_();
		if (prevContent && prevContent.isLoaded() && prevContent === content) {
			// Already loaded a same content
			container.layout();
			return;
		}

		this.detachContent_();

		container.setContent(content);

		this.attachContent_();
		this.setTitle_(content.getTitle());

		content.load();
		container.layout();
	}

	/** @private */
	layout_(forceLayout) {
		const needsResizing = (forceLayout || this.repositionOnScroll_);

		if (needsResizing) {
			this.animation_.resizeFrame(this.frame_);
		}
	}

	/** @private */
	updatePager_() {
		const pager = this.pager_;

		const page = pager.getPage();
		const totalPages = pager.getTotalPages();
		const text =
			String(page + 1) +
			' of ' +
			String(totalPages);

		const label = this.pagerLabel_;
		label.setText(text);

		this.prevButton_.setDisabled(!pager.hasPrevious());
		this.nextButton_.setDisabled(!pager.hasNext());
	}

	/** @private */
	updateContent_() {
		this.updatePager_();

		const index = this.pager_.getPage();
		const content = this.contents_[index];
		this.setContent_(content);
	}

	/** @private */
	delayedLayout_(forceLayout) {
		if (this.layoutTimeout_) {
			clearTimeout(this.layoutTimeout_);
		}

		this.layoutTimeout_ = setTimeout(() => {
			this.layout_(forceLayout);
		}, Vanillabox.DELAYED_LAYOUT_DELAY);
	}

	/** @private */
	onWindowResize_() {
		this.delayedLayout_(false);
	}

	/** @private */
	onWindowScroll_() {
		this.delayedLayout_(false);
	}

	/** @private */
	onDocumentKeyUp_(e) {
		if (!this.supportsKeyboard_) {
			return;
		}

		switch (e.keyCode) {
			case 27:  // Escape
				this.hide();
				break;
			case 37:  // Left
				this.previous();
				break;
			case 39:  // Right
				this.next();
				break;
		}
	}

	/** @private */
	onTargetElementClick_(e) {
		const index = this.targetElems_.index(e.delegateTarget);

		if (index < 0) {
			return;
		}

		e.preventDefault();

		this.show(index);
	}

	/** @private */
	onPagerChange_() {
		this.updateContent_();
	}

	/** @private */
	onMaskClick_() {
		if (!this.closeButtonEnabled_) {
			this.hide();
		}
	}

	/** @private */
	onCloseButtonClick_() {
		if (!this.closeButtonEnabled_) {
			return;
		}

		this.hide();
	}

	/** @private */
	onPreviousButtonClick_() {
		this.previous();
	}

	/** @private */
	onNextButtonClick_() {
		this.next();
	}

	/** @private */
	onContentComplete_(e, success) {
		this.layout_(true);

		const content = e.target;
		const index = Util.Array.indexOf(this.contents_, content);
		if (index >= 0) {
			$(this).trigger(Events.LOAD, [success, content, index]);
		}
	}

	/** @private */
	onContentClick_(e) {
		const pager = this.pager_;

		e.stopPropagation();

		if (!this.grouping_) {
			this.hide();
			return;
		}

		if (!pager.hasNext()) {
			this.hide();
		}
		else {
			this.next();
		}
	}

	/** @private */
	onContentHide_(e, container, content) {
		if (content.shouldUnloadOnHide()) {
			content.unload();
		}
	}
}

Vanillabox.DELAYED_LAYOUT_DELAY = 300;

module.exports = Vanillabox;
